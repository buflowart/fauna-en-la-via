# Prompt para Fable: plan maestro de Fauna en la Vía

> Cómo usarlo: abrir Claude Code **con el modelo Fable 5.2** (esfuerzo alto) parado en la carpeta del repo clonado,
> y pegar todo lo que está debajo de la línea. Si se arranca en Opus, el prompt le pide delegar el plan en Fable.
> Fable está disponible hasta el **16 de noviembre de 2026**: esta sesión es para pensar, no para programar.

---

Sos el planificador principal de **Fauna en la Vía**. Tu trabajo en esta sesión es dejar un plan tan claro y tan bien
partido que dos personas y modelos más chicos (Opus, Sonnet, Haiku) lo puedan ejecutar solos durante meses, **cuando vos
ya no estés disponible** (después del 16-nov-2026). Si este prompt lo está corriendo un modelo que no es Fable 5.2,
lanzá un subagente con `model: "fable"` para hacer las fases 1 a 4 y vos encargate solo de revisar y guardar los archivos.

## El proyecto

Plataforma **nacional** de ciencia ciudadana para registrar **fauna atropellada en las vías de Colombia**. Cualquier
persona que vea un animal muerto en una vía lo reporta desde el navegador del celular (foto + ubicación + lo que
sepa), sin instalar nada: **el portal principal es una página web**, no una app, porque nadie descarga una app para
algo que le pasa de vez en cuando. Los reportes los validan biólogos y alimentan un mapa público y datos abiertos.
Objetivo de fondo: **conseguir pasos de fauna** y reducir la mortalidad, con datos georreferenciados que sirvan como
prueba ante las autoridades (ANLA, corporaciones autónomas), los concesionarios y los fondos.

**Piloto:** la Autopista al Río Magdalena 2, UF1–UF2 (Remedios, Vegachí, Yalí, Yolombó, Maceo; Antioquia). Es donde
ya hay datos, terreno y un caso legal concreto. El plan tiene que mostrar cómo se pasa del piloto al país sin rehacer
todo.

**Lo primero que tenés que resolver:** ya existen esfuerzos nacionales e internacionales parecidos (Recosfa / Red
Colombiana de Seguimiento de Fauna Atropellada, iNaturalist, SiB Colombia / GBIF, entre otros). Investigá qué hace
cada uno, qué datos tienen y cómo se puede publicar en ellos. Recomendá con argumentos si conviene **competir,
complementar o aliarse** (por ejemplo: nuestro portal capta y valida, y exporta en estándar Darwin Core a SiB/GBIF).
Un proyecto chico que duplica una red existente pierde aliados y fondos.

Equipo (los dos tienen GitHub):
- **Rubén** (quien te está hablando), **ingeniero agrónomo**: dueño del proyecto, conoce la zona, el territorio y los datos; hace terreno. No es biólogo: para identificar especies y dar aval científico el plan tiene que prever aliados (biólogos, universidades).
- **Alejandro**: le propuso a Rubén la idea de hacer esta plataforma y es cofundador; lleva la parte técnica (web, mapas, análisis, agentes de IA). Trabaja con Claude Code. Las decisiones del proyecto las toma Rubén como dueño, consultando a Alejandro.

Lo que ya existe en este repo (leelo entero antes de opinar). **Empezá por `docs/CONTEXTO.md`**: resume todo lo que se
hizo y se encontró en las sesiones anteriores, que vos no viste. Tu memoria y las notas de Rubén no saben nada de esto.
- `index.html`: mapa Leaflet de una sola página que lee **en vivo** la hoja de Google de Rubén (gviz CSV).
  102 registros (101 con coordenadas, 94 validados, 52 especies, 81 con foto en Drive). Capas: conectividad del ocelote
  (diapositiva de un estudio de Linkage Mapper, ubicada a mano, ilustrativa), bosque IDEAM 2025 (por defecto) y Hansen.
  Los botones Reportar y Validar **todavía no escriben** en ninguna parte.
- `analisis/`: scripts de Python que generan las capas de bosque (`bosque_corredor.py`, `comparar_ideam.py`).
- `reports/Financiación fauna atropellada Antioquia.md` y `research_notes/`: investigación de fondos, vías regulatorias
  y la licencia ANLA (Res. 763/2016, exp. LAV0017-00-2016). Conclusión principal: la palanca es la licencia; el cuello
  de botella es que **no hay personería jurídica**.
- `README.md` y `docs/TRABAJAR_JUNTOS.md` (cómo trabajan Rubén y Alejandro con GitHub).

Hechos que no se negocian:
- Los registros son fotos de Rubén y de conocidos: son **registros reportados, no el total de animales muertos**.
  Hay sesgo de muestreo. Nunca presentarlos como mortalidad total.
- Deforestación y obra de la vía **coinciden en el tiempo; eso no prueba causa**. Ninguna fuente de bosque da certeza.
- El repo y la página fueron temporales en la cuenta `buflowart` (marca de Alejandro); el proyecto va a tener sus
  propias cuentas. No mezclar con Buflow.

## Fase 0 — Entrevista (antes de planear nada)

Hacele a Rubén **una sola tanda de preguntas** (máximo 12, agrupadas, con opciones cuando se pueda) sobre lo que no
está en el repo y cambia el plan. Como mínimo: qué resultado concreto sería "éxito" en 6 y en 12 meses; para quién es
el mapa primero (ANLA, concesionario, comunidad, academia, fondos); cuántas horas por semana tiene cada uno; plata
disponible; si quiere constituir una asociación y con quién; con qué universidad o grupo tiene vínculo; de quién son
los datos y las fotos y bajo qué licencia se pueden publicar; qué datos de quienes reportan hay que proteger; si ya
habló con la ANLA, Corantioquia, el concesionario o Recosfa; cómo se hace hoy el muestreo (recorridos, frecuencia,
quién); qué relación tiene hoy con Recosfa u otras redes; quién valida los reportes cuando lleguen de todo el país
(él solo, una red de biólogos voluntarios, universidades); cómo quieren dejar escritos los roles y el crédito entre Rubén y Alejandro (fundadores, crédito público, quién firma y decide). Esperá las respuestas. No inventes lo que no te contesten: anotalo como supuesto.

## Fase 1 — Verificar contra la realidad

Antes de afirmar algo del estado del proyecto, **medilo en el artefacto vivo** (la página corriendo con
`python -m http.server 8790`, la hoja, los scripts, los archivos), no en este prompt ni en los .md. Separá siempre:
**verificado (cómo)** / **inferido** / **de memoria o sin fuente**. Si algo de este prompt resulta falso, decilo.

## Fase 2 — El plan (archivos en el repo)

Escribí en español, directo, sin relleno:

1. **`PLAN.md`** — una página de visión y después:
   - Criterios de éxito **medibles** a 3, 6 y 12 meses.
   - Frentes de trabajo, como mínimo: (a) portal web y datos: reporte desde el navegador del celular en menos de
     un minuto (foto, GPS, especie si la sabe, sin cuenta obligatoria); funciona como web instalable (PWA) y guarda el
     reporte si no hay señal en la vía; moderación contra spam, fotos impropias y ubicaciones falsas; cola de
     validación por expertos (biólogos aliados); privacidad de quien reporta (quitar metadatos EXIF de la foto, no publicar su ubicación
     exacta ni su nombre sin permiso); licencia de las fotos y los datos; datos abiertos en Darwin Core; estándar de la
     Guía de pasos de fauna de MinAmbiente 2025 (PR de la vía, esfuerzo de muestreo, foto, distancia al paso más
     cercano) donde aplique; cobertura de todas las vías del país; (a2) escala y servidores (ver abajo); (b) ciencia (hotspots con método publicable tipo Siriema/KDE+, corrección
     por esfuerzo, conectividad/corredores de menor costo, validación en terreno); (c) vía legal (derechos de
     petición a la ANLA, copia del expediente, tercero interviniente); (d) organización y financiación (personería,
     alianzas, calendario de convocatorias); (e) comunicación y campañas para que la gente reporte.
   - **Hitos con fechas** de nov-2026 a dic-2027 y la **ruta crítica** (qué bloquea a qué).
   - Riesgos con su mitigación, y **decisiones abiertas** con quién decide y para cuándo.
   - **Plan de escala (`docs/ESCALA.md`)**, por si el proyecto tiene mucha acogida (una nota en un noticiero puede
     traer miles de reportes en un día). Etapas con **disparadores medibles** (reportes por día, usuarios, GB de
     fotos, costo mensual) y, para cada etapa: arquitectura, servicios concretos con su costo estimado en USD
     (empezar gratis o casi gratis: por ejemplo GitHub Pages + Supabase/Firebase/Cloudflare; luego base PostGIS
     administrada y almacenamiento de objetos para fotos; luego lo que corresponda), qué se rompe primero y cómo se
     nota antes de que se rompa. Plan de **migración** entre etapas paso a paso, y reglas para no quedar atados a un
     proveedor desde el día uno (base estándar como PostgreSQL/PostGIS, fotos en almacenamiento compatible S3,
     exportación completa de los datos en cualquier momento). Incluí qué hacer el día de un pico (modo de
     emergencia: aceptar reportes aunque la validación se atrase) y cómo pedir créditos gratuitos para ONG
     (Google, AWS, Microsoft, Cloudflare) cuando exista la asociación. Citá precios con fuente y fecha.
2. **Tareas** — cada una autocontenida, para que un agente sin contexto la pueda tomar: objetivo, contexto mínimo,
   archivos que toca, pasos, **criterio de "hecho" verificable** (qué se mide o se mira para darla por cerrada),
   dependencias, tamaño (S/M/L), dueño (`ruben` / `alejandro` / `agente`) y **modelo recomendado** (ver tabla abajo).
   Si `gh` está autenticado, creálas como **issues** con etiquetas (`frente:*`, `modelo:*`, `dueño:*`) y armá un
   GitHub Project con columnas Por hacer / En curso / En revisión / Hecho. Si no, dejalas en `docs/tareas/NNN-nombre.md`
   más un script `docs/tareas/crear_issues.sh` que las suba después.
3. **`CLAUDE.md`** del repo — lo que cualquier agente tiene que saber al entrar: qué es el proyecto, estructura,
   cómo correrlo, convenciones (ramas, commits, PR), los hechos que no se negocian de arriba, qué nunca hacer
   (publicar datos personales de quien reporta, subir claves, afirmar causalidad, hablar de "total de muertes"),
   y cómo verificar un cambio antes de pedir revisión.
4. **`docs/DECISIONES.md`** — registro corto de decisiones (fecha, decisión, alternativas descartadas, por qué).

## Fase 3 — Tu criterio, puesto por escrito (lo más importante)

Cuando no estés, el plan lo van a ejecutar modelos menos capaces. Lo que se pierde no es el plan: es **tu forma de
decidir y de revisar**. Escribí **`docs/METODO.md`** para que Opus/Sonnet lo apliquen sin vos:

- Cómo priorizás (qué mirás primero, qué dejás para después y por qué).
- Cómo verificás: qué cuenta como evidencia en este proyecto (en datos, en mapas, en textos legales, en código).
- **Listas de revisión** por tipo de entrega: cambio de código, análisis espacial, documento para la ANLA,
  postulación a un fondo, pieza de campaña. Cada una ordenada por severidad: lo que invalida la entrega /
  lo que la debilita / lo menor.
- Errores típicos que esperás de un modelo más chico en este proyecto y cómo detectarlos.
- Cuándo un agente tiene que **parar y preguntar** a un humano, y cuándo escalar a un modelo más fuerte.
- Un "bucle de revisión": quien construye no se aprueba a sí mismo; un revisor con contexto fresco mira el
  artefacto real (no el resumen del constructor) y nombra **una** brecha por ronda.

Esto es lo que ya observamos de tus revisiones en otro proyecto (placas electrónicas); confirmalo, corregilo o
ampliá lo que no aplique acá:
- Revisás el artefacto real, nunca el resumen; cada hallazgo con evidencia medida (archivo, línea, coordenada, valor).
- Veredicto primero ("se puede / no se puede, y qué arreglar antes"), después hallazgos numerados por severidad.
- Una sección "verificado correcto (medido)" separada de "de memoria / sin fuente".
- Lo que se posterga queda escrito con el motivo, no se olvida.
- Buscás primero lo que tira todo el trabajo, después lo que lo encarece, al final la estética.

## Fase 4 — Usar a Fable donde más rinde, antes del 16-nov

Elegí las **2 o 3 tareas que de verdad necesitan tu nivel** y que serían caras o riesgosas de hacer después con un
modelo menor (candidatos: la decisión competir/complementar/aliarse con las redes existentes; la arquitectura
inicial y el plan de escala, porque una mala base cuesta caro migrar; diseño del modelo de datos y de la privacidad
de los reportes; el borrador del derecho de
petición a la ANLA y la estrategia legal; el método científico de hotspots y corrección del sesgo). Proponélas, y si
Rubén dice que sí, hacelas en esta sesión. El resto queda en tareas para después.

## Tabla de modelos (incluíla en `METODO.md` y ajustala)

| Trabajo | Modelo |
|---|---|
| Estrategia, decisiones con consecuencias legales o científicas, revisión final de algo que sale afuera | Opus (Fable si hay) |
| Programar una tarea bien especificada, análisis con scripts, borradores | Sonnet |
| Tareas mecánicas: formatear, renombrar, resumir, mover datos | Haiku |
| Terreno, contactos, firmas, decisiones del proyecto | Humanos |

## Reglas de esta sesión

- **No escribas código de la app** salvo una prueba mínima que haga falta para decidir algo del plan.
- No hagas `push` ni publiques nada sin el OK explícito de Rubén. Trabajá en una rama `plan-fable` y abrí un PR.
- No pongas datos personales (nombres de quien reporta, teléfonos, ubicación de casas) en ningún archivo del repo.
- Citá la fuente de cada dato externo (URL o documento). Si no tenés fuente, decilo.
- Rubén usa **Obsidian**. Al terminar, ofrecele escribir en su vault una nota corta del proyecto (qué es, enlace al
  repo, decisiones tomadas, próximos pasos) siguiendo las convenciones que ya tenga su vault. El plan vive en el
  repo; Obsidian solo apunta a él, así no hay dos versiones que se contradigan.
- Al terminar: un resumen de 10 líneas con qué quedó hecho, qué quedó pendiente, y **las 3 primeras tareas** con las
  que hay que arrancar el lunes.
