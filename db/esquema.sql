-- Fauna en la Vía — esquema de datos, versión 0.1 (16 nov 2026)
-- PostgreSQL 15 o superior, con PostGIS.
-- PROPUESTA: no se ha ejecutado contra una base. Antes de usarlo, correrlo en una
-- base de prueba y cargar la hoja del piloto (ver docs/MODELO_DATOS.md, sección 8).
-- Explicación de cada tabla y de las decisiones: docs/MODELO_DATOS.md

create extension if not exists postgis;
create extension if not exists pgcrypto;  -- gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
create type tipo_fuente      as enum ('propia', 'ciudadano', 'concesion', 'autoridad', 'red');
create type tipo_registro    as enum ('atropellado', 'lesionado', 'vivo');
create type estado_registro  as enum ('recibido', 'en_revision', 'dudoso', 'validado', 'rechazado', 'duplicado');
create type origen_ident     as enum ('reportante', 'ia', 'validador', 'fuente');
create type nivel_confianza  as enum ('alta', 'media', 'baja');
create type cat_uicn         as enum ('EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE');
create type cat_nacional     as enum ('CR', 'EN', 'VU');
create type rol_persona      as enum ('reportante', 'validador', 'administrador');
create type medio_recorrido  as enum ('a_pie', 'bicicleta', 'moto', 'carro', 'otro');
create type tipo_cruce       as enum ('mismo_animal', 'posible', 'descartado');

-- ---------------------------------------------------------------------------
-- Fuentes: de dónde viene cada registro
-- ---------------------------------------------------------------------------
create table fuente (
  id          smallint generated always as identity primary key,
  tipo        tipo_fuente not null,
  nombre      text not null unique,      -- 'Nordeste Salvaje', 'Reporte ciudadano', 'Concesión Autopista Río Magdalena', ...
  licencia    text,                      -- condiciones con que se pueden publicar sus datos
  publicable  boolean not null default false,
  notas       text
);

-- ---------------------------------------------------------------------------
-- Taxones y categorías de amenaza
-- ---------------------------------------------------------------------------
create table taxon (
  id                  integer generated always as identity primary key,
  nombre_cientifico   text not null unique,          -- nombre vigente que usa el proyecto
  rango               text not null default 'especie', -- especie, genero, familia, orden, clase (para "sin identificar")
  nombre_comun        text,
  grupo               text not null,                 -- Ave, Mamífero, Reptil, Anfibio, Invertebrado, Doméstico
  clase               text,
  orden               text,
  familia             text,
  gbif_id             bigint,
  -- Lista Roja de la UICN (global)
  uicn                cat_uicn,
  uicn_consultada     date,
  uicn_url            text,
  -- Resolución 0126 de 2024 de MinAmbiente (nacional)
  nacional            cat_nacional,
  nombre_en_res_0126  text,                          -- nombre con que aparece en la resolución, si es distinto
  -- Publicación de la ubicación. 0 = exacta. Decisión 8: hoy todo va en 0.
  difuminar_m         integer not null default 0 check (difuminar_m >= 0),
  notas               text
);

-- Un taxón es amenazado si lo es en cualquiera de las dos listas.
create or replace function es_amenazado(t taxon) returns boolean
language sql immutable as $$
  select t.nacional is not null or t.uicn in ('CR', 'EN', 'VU');
$$;

-- ---------------------------------------------------------------------------
-- Personas. TABLA PRIVADA: nunca entra en vistas públicas.
-- ---------------------------------------------------------------------------
create table persona (
  id               uuid primary key default gen_random_uuid(),
  rol              rol_persona not null default 'reportante',
  nombre           text,
  contacto         text,                 -- correo o teléfono, solo si lo dio
  credito_publico  boolean not null default false,  -- ¿autorizó que su nombre salga?
  nombre_credito   text,                 -- cómo quiere figurar, si autorizó
  usuario_auth     uuid unique,          -- cuenta del proveedor de autenticación (validadores)
  dispositivo      text,                 -- huella anónima, para límites de envío
  creado           timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Vías, puntos de referencia (PR) y estructuras
-- ---------------------------------------------------------------------------
create table via (
  id          integer generated always as identity primary key,
  nombre      text not null,             -- 'Autopista al Río Magdalena 2'
  codigo      text,                      -- código de ruta, si lo tiene
  concesion   text,                      -- nulo si no es concesionada
  sigla       text,                      -- 'ARM', 'VDN', 'ADN'; 'VR' para vía rural
  generacion  text,                      -- generación de la concesión: '4G', '5G', ...; nulo si no es concesionada
  generacion_fuente text,                -- de dónde salió el dato (contrato, ficha de la ANI)
  geom        geometry(MultiLineString, 4326)
);

create table tramo (                     -- unidad funcional u otro tramo con nombre
  id        integer generated always as identity primary key,
  via_id    integer not null references via(id),
  nombre    text not null,               -- 'UF2'
  geom      geometry(MultiLineString, 4326),
  unique (via_id, nombre)
);

create table pr (                        -- puntos de referencia de la vía
  id        integer generated always as identity primary key,
  via_id    integer not null references via(id),
  tramo_id  integer references tramo(id),
  pr_km     integer not null,            -- el 11 de 'PR 11+650'
  pr_m      integer not null default 0,  -- el 650
  geom      geometry(Point, 4326) not null,
  fuente    text,
  unique (via_id, tramo_id, pr_km, pr_m)
);
create index pr_geom_idx on pr using gist (geom);

create table estructura (                -- pasos de fauna, viaductos y obras hidráulicas
  id            integer generated always as identity primary key,
  codigo        text unique,             -- 'PF-01'
  tipo          text not null,           -- 'Aéreo (arborícola)', 'Terrestre', 'Viaducto', 'Obra hidráulica'
  nombre        text,
  via_id        integer references via(id),
  tramo_id      integer references tramo(id),
  pr_texto      text,                    -- '11+650', como lo da la fuente
  geom          geometry(Point, 4326),
  estado        text not null,           -- 'Verificada en campo', 'Reportada', 'Solicitado (no existe)'
  existe        boolean not null default true,  -- falso para las solicitadas: no cuentan como paso
  fuente_coord  text,
  verificada    date,
  observaciones text
);
create index estructura_geom_idx on estructura using gist (geom);

-- ---------------------------------------------------------------------------
-- Esfuerzo: cada recorrido, aunque no encuentre nada
-- ---------------------------------------------------------------------------
create table recorrido (
  id           uuid primary key default gen_random_uuid(),
  fecha        date not null,
  hora_inicio  time,
  hora_fin     time,
  via_id       integer references via(id),
  tramo_id     integer references tramo(id),
  desde        text,                     -- PR o lugar
  hasta        text,
  km           numeric(6,2),             -- longitud recorrida
  geom         geometry(MultiLineString, 4326),
  medio        medio_recorrido not null,
  velocidad_kmh integer,
  buscando     boolean not null,         -- cierto: iba buscando; falso: iba de paso
  con_protocolo boolean not null default false,  -- cumple el protocolo del tramo (tarea 011)
  persona_id   uuid references persona(id),
  notas        text,
  creado       timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Registros
-- ---------------------------------------------------------------------------
create table registro (
  id            uuid primary key default gen_random_uuid(),
  codigo        text unique,             -- código público: 'ARM-UF2-036', 'VIV-ARM-UF2-001', 'FEV-000123'
  codigo_anterior text,
  fuente_id     smallint not null references fuente(id),
  id_origen     text,                    -- identificador que traía en su fuente ('ARM No. 79')
  tipo          tipo_registro not null default 'atropellado',
  estado        estado_registro not null default 'recibido',
  motivo_rechazo text,
  duplicado_de  uuid references registro(id),

  -- Cuándo. La fecha y la hora son del hallazgo, no del envío.
  fecha         date,
  hora          time,
  recibido      timestamptz not null default now(),

  -- Dónde. Dos geometrías: la real (privada) y la que se publica.
  geom          geometry(Point, 4326) not null,
  precision_m   integer,                 -- precisión del GPS, si se conoce
  geom_publica  geometry(Point, 4326),   -- la llena un disparador; ver abajo
  via_id        integer references via(id),
  tramo_id      integer references tramo(id),
  pr_km         integer,                 -- calculados con la tabla pr
  pr_m          integer,
  municipio     text,
  departamento  text,
  estructura_id integer references estructura(id),  -- la más cercana que existe
  estructura_dist_m integer,

  -- Qué. Especie validada; el historial está en identificacion.
  taxon_id      integer references taxon(id),

  -- Contexto
  recorrido_id  uuid references recorrido(id),
  persona_id    uuid references persona(id),        -- quién reportó (privado)
  nota_publica  text,
  nota_interna  text,                               -- nunca sale
  detalle       jsonb not null default '{}',        -- campos propios del tipo (fauna viva: dónde estaba, qué hacía, resultado)
  datos_origen  jsonb,                              -- la fila tal como llegó de la fuente

  validado_por  uuid references persona(id),
  validado_en   timestamptz,
  actualizado   timestamptz not null default now(),

  -- Requisito mínimo de un registro (decisión 7): coordenadas, fecha y hora.
  -- No se impone como restricción porque el piloto tiene registros validados sin
  -- hora (3) y sin fecha (1). Se marca, y los análisis en el tiempo usan solo los completos.
  completo      boolean generated always as (fecha is not null and hora is not null) stored,
  constraint validado_con_taxon check (estado <> 'validado' or taxon_id is not null),
  constraint duplicado_apunta check ((estado = 'duplicado') = (duplicado_de is not null)),
  constraint en_colombia check (
    st_x(geom) between -82.0 and -66.8 and st_y(geom) between -4.3 and 13.5
  ),
  unique (fuente_id, id_origen)
);
create index registro_geom_idx   on registro using gist (geom);
create index registro_estado_idx on registro (estado);
create index registro_fecha_idx  on registro (fecha);
create index registro_taxon_idx  on registro (taxon_id);

-- La coordenada publicada: exacta, salvo que el taxón tenga difuminar_m > 0.
-- En ese caso se redondea a una cuadrícula de ese tamaño (no se suma ruido
-- aleatorio, que se puede promediar para recuperar el punto).
create or replace function fijar_geom_publica() returns trigger
language plpgsql as $$
declare d integer;
begin
  select coalesce(t.difuminar_m, 0) into d from taxon t where t.id = new.taxon_id;
  if coalesce(d, 0) = 0 then
    new.geom_publica := new.geom;
  else
    new.geom_publica := st_transform(
      st_snaptogrid(st_transform(new.geom, 3116), d), 4326);  -- 3116: MAGNA-SIRGAS Bogotá, en metros
  end if;
  new.actualizado := now();
  return new;
end $$;

create trigger registro_geom_publica
  before insert or update of geom, taxon_id on registro
  for each row execute function fijar_geom_publica();

-- ---------------------------------------------------------------------------
-- Fotos
-- ---------------------------------------------------------------------------
create table foto (
  id           uuid primary key default gen_random_uuid(),
  registro_id  uuid not null references registro(id) on delete cascade,
  orden        smallint not null default 1,          -- a, b, c
  ruta         text not null,                        -- ruta del objeto en el almacenamiento, no la URL
  url_externa  text,                                 -- fotos que siguen en Drive durante la transición
  sha256       text,                                 -- para detectar la misma foto enviada dos veces
  ancho        integer,
  alto         integer,
  sin_exif     boolean not null default false,       -- se comprobó que no trae metadatos
  fuerte       boolean not null default true,        -- se muestra con aviso
  licencia     text,
  autor_id     uuid references persona(id),
  publicable   boolean not null default false,       -- hay permiso para mostrarla
  unique (registro_id, orden)
);

-- ---------------------------------------------------------------------------
-- Identificaciones: historial, nunca se sobrescribe
-- ---------------------------------------------------------------------------
create table identificacion (
  id            uuid primary key default gen_random_uuid(),
  registro_id   uuid not null references registro(id) on delete cascade,
  origen        origen_ident not null,
  taxon_id      integer references taxon(id),
  nombre_dado   text,                    -- lo que escribió la persona o la fuente, tal cual
  confianza     nivel_confianza,         -- obligatorio cuando el origen es la IA
  razones       text,                    -- caracteres en que se basa
  alternativas  jsonb,                   -- otras especies posibles
  modelo        text,                    -- qué modelo propuso, y versión
  persona_id    uuid references persona(id),
  creado        timestamptz not null default now(),
  constraint ia_con_confianza check (origen <> 'ia' or confianza is not null)
);
create index identificacion_registro_idx on identificacion (registro_id, creado);

-- ---------------------------------------------------------------------------
-- Cruces entre registros (misma carcasa, coincidencia entre fuentes)
-- ---------------------------------------------------------------------------
create table cruce (
  a            uuid not null references registro(id) on delete cascade,
  b            uuid not null references registro(id) on delete cascade,
  tipo         tipo_cruce not null default 'posible',
  distancia_m  integer,
  dias         integer,
  decidido_por uuid references persona(id),
  nota         text,
  primary key (a, b),
  check (a < b)
);

-- ---------------------------------------------------------------------------
-- Vistas públicas: lo ÚNICO que leen la página y las exportaciones
-- ---------------------------------------------------------------------------
create view registro_publico as
select
  r.codigo,
  r.tipo,
  r.fecha,
  r.hora,
  r.completo,
  st_y(r.geom_publica) as latitud,
  st_x(r.geom_publica) as longitud,
  (t.difuminar_m > 0)  as ubicacion_difuminada,
  t.nombre_cientifico,
  t.nombre_comun,
  t.grupo,
  t.uicn,
  t.nacional,
  es_amenazado(t)      as amenazada,
  f.tipo               as fuente_tipo,
  f.nombre             as fuente,
  v.nombre             as via,
  v.concesion,
  v.generacion,
  tr.nombre            as tramo,
  r.pr_km, r.pr_m,
  r.municipio, r.departamento,
  e.codigo             as estructura_cercana,
  e.tipo               as estructura_tipo,
  r.estructura_dist_m,
  r.nota_publica,
  case when p.credito_publico then p.nombre_credito end as credito
from registro r
join fuente f        on f.id = r.fuente_id and f.publicable
join taxon t         on t.id = r.taxon_id
left join via v      on v.id = r.via_id
left join tramo tr   on tr.id = r.tramo_id
left join estructura e on e.id = r.estructura_id
left join persona p  on p.id = r.persona_id
where r.estado = 'validado';

create view foto_publica as
select r.codigo, fo.orden, fo.ruta, fo.url_externa, fo.fuerte, fo.licencia,
       case when p.credito_publico then p.nombre_credito end as credito
from foto fo
join registro r on r.id = fo.registro_id and r.estado = 'validado'
join fuente f   on f.id = r.fuente_id and f.publicable
left join persona p on p.id = fo.autor_id
where fo.publicable;

create view estructura_publica as
select codigo, tipo, nombre, pr_texto, st_y(geom) as latitud, st_x(geom) as longitud, estado, existe
from estructura;

-- Esfuerzo agregado, sin personas.
create view esfuerzo_publico as
select date_trunc('month', fecha)::date as mes, via_id, tramo_id, medio, buscando, con_protocolo,
       count(*) as recorridos, sum(km) as km
from recorrido
group by 1, 2, 3, 4, 5, 6;

-- ---------------------------------------------------------------------------
-- Permisos
-- ---------------------------------------------------------------------------
-- Regla: el rol anónimo (la página) NO lee ninguna tabla. Solo las vistas públicas.
-- Los reportes entran por una función del servidor, no por inserción directa.
alter table fuente         enable row level security;
alter table taxon          enable row level security;
alter table persona        enable row level security;
alter table via            enable row level security;
alter table tramo          enable row level security;
alter table pr             enable row level security;
alter table estructura     enable row level security;
alter table recorrido      enable row level security;
alter table registro       enable row level security;
alter table foto           enable row level security;
alter table identificacion enable row level security;
alter table cruce          enable row level security;

-- En Supabase el rol anónimo se llama 'anon'. Ajustar si el proveedor es otro.
-- grant select on registro_publico, foto_publica, estructura_publica, esfuerzo_publico to anon;
-- Las políticas para validadores y administradores se escriben al implementar la tarea 007.
