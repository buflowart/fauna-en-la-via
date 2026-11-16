# Plan de escala

16 nov 2026. Precios consultados ese día en las páginas oficiales que se citan. Cambian: hay que volver a mirarlos antes de decidir.

## Punto de partida

- Presupuesto: cero. Solo servicios gratuitos hasta que haya fondos o créditos para ONG.
- Volumen actual: unos 4 registros al mes. Un registro pesa poco; lo que pesa son las fotos.
- Regla de tamaño: la foto se comprime en el celular antes de subir, a unos 300 KB (lado largo de 1.600 px). Con eso, 1 GB son unas 3.300 fotos.

## Reglas para no quedar atados a un proveedor

1. **Base de datos:** PostgreSQL con PostGIS, sin funciones exclusivas de un proveedor en el modelo de datos.
2. **Fotos:** almacenamiento de objetos compatible con S3. En la base se guarda la ruta del objeto, no la URL del proveedor.
3. **Exportación completa siempre:** un script deja todos los datos (CSV y GeoJSON) y la lista de fotos. Corre cada mes y la copia queda fuera del proveedor.
4. **El sitio es estático:** HTML, CSS y JavaScript que se pueden servir desde cualquier parte.
5. **Las claves** van en los secretos del proveedor o de GitHub, nunca en el repositorio.

## Etapas

| Etapa | Disparador para entrar | Arquitectura | Costo al mes |
|---|---|---|---|
| **0. Hoy** | — | Página estática en GitHub Pages que lee una copia pública filtrada de la hoja. Fotos en Drive | 0 USD |
| **1. Reportar** | Tareas 003 y 005 cerradas | Sitio en GitHub Pages. Base y cuentas de validadores en Supabase (plan gratuito). Fotos en Cloudflare R2 (plan gratuito) | 0 USD |
| **2. Crecimiento** | Cualquiera: más de 50 reportes al día durante una semana; base por encima de 400 MB; fotos por encima de 8 GB; el proyecto gratuito se pausa o se queda corto | Supabase Pro. Fotos siguen en R2. Copias de seguridad automáticas | 25 USD de base, más fotos por encima de 10 GB |
| **3. Nacional** | Cualquiera: más de 1.000 reportes al día sostenidos; más de 100 GB de fotos; más de 100 USD al mes | PostGIS administrado con más capacidad, cola de procesamiento para la identificación, CDN para las fotos, monitoreo | 100 a 300 USD (estimado sin cotizar) |

### Etapa 0 — hoy
- **Qué se rompe primero:** las miniaturas de Drive (dependen de que cada foto esté compartida y Google puede limitarlas) y los mosaicos de OpenStreetMap si el tráfico sube mucho.
- **Cómo se nota antes:** fotos que no cargan en la página; el mapa base en gris.
- **Qué falta:** que la página deje de leer la hoja maestra (tarea 001).

### Etapa 1 — reportar que guarda
- **Supabase gratuito:** 500 MB de base, 1 GB de archivos, 5 GB de salida de datos, 2 proyectos, y **el proyecto se pausa tras una semana sin actividad** ([supabase.com/pricing](https://supabase.com/pricing), 16 nov 2026).
- **Cloudflare R2 gratuito:** 10 GB de almacenamiento, 1 millón de operaciones de escritura y 10 millones de lectura al mes; la salida de datos no se cobra ([developers.cloudflare.com/r2/pricing](https://developers.cloudflare.com/r2/pricing/), 16 nov 2026). Son unas 33.000 fotos de 300 KB.
- **Por qué las fotos en R2 desde el principio:** el gigabyte de Supabase alcanza para unas 3.300 fotos, y una nota en un noticiero puede multiplicar las visitas. En R2 las visitas no cuestan.
- **Qué se rompe primero:** la pausa por inactividad. Se evita con una tarea programada en GitHub Actions que consulta la base cada día.
- **Cómo se nota antes:** un tablero simple con tamaño de la base, gigabytes de fotos y reportes por día, revisado cada mes.
- **Alternativa descartada por ahora:** escribir los reportes en la hoja de Google con Apps Script. Es lo más rápido de montar, pero no tiene PostGIS, mezcla lo público con la hoja de trabajo y obliga a migrar justo cuando el proyecto crezca.

### Etapa 2 — crecimiento
- **Supabase Pro:** desde 25 USD al mes, con 8 GB de base, 100 GB de archivos y 250 GB de salida; no se pausa. Excedentes: 0,125 USD por GB de base y 0,09 USD por GB de salida ([supabase.com/pricing](https://supabase.com/pricing), 16 nov 2026).
- **R2 por encima de lo gratuito:** 0,015 USD por GB al mes. 100 GB de fotos (unas 330.000) cuestan cerca de 1,35 USD al mes.
- **Migración de 1 a 2:** es un cambio de plan en el mismo proyecto. No se mueve ningún dato.
- **Qué se rompe primero:** la cola de validación, no los servidores. Con 50 reportes al día, una sola persona no da abasto.

### Etapa 3 — nacional
- **Migración de 2 a 3**, paso a paso:
  1. Exportar la base completa (`pg_dump`) y restaurarla en el proveedor nuevo.
  2. Probar el sitio contra la base nueva en una dirección de prueba.
  3. Congelar los reportes unos minutos, hacer la exportación final y cambiar la dirección de la API.
  4. Las fotos no se mueven si siguen en R2.
- **Qué se rompe primero:** las consultas espaciales sin índices y el costo de la identificación automática.
- Los precios de esta etapa se cotizan cuando el disparador esté cerca. Hoy sería inventarlos.

## El día de un pico

Una nota en televisión puede traer miles de reportes en un día. Modo de emergencia:

1. **Aceptar siempre el reporte.** Guardar primero, validar después.
2. **No publicar sin validar.** El mapa muestra solo lo validado, y un contador de "reportes en revisión".
3. **Pausar la identificación automática** si cuesta o se atrasa; se procesa después por lotes.
4. **Endurecer los límites** de envío por dispositivo si aparece spam.
5. **Avisar en la página** que la validación va con retraso.
6. **Al día siguiente:** revisar el consumo, subir de plan si el disparador se cumplió y pedir ayuda a validadores aliados.

## Créditos gratuitos para ONG

Cuando la corporación exista, pedir los programas para organizaciones sin ánimo de lucro de Google, Microsoft, AWS y Cloudflare. **Sin verificar:** requisitos, montos y si aplican a organizaciones colombianas. Se confirma en la página de cada programa cuando haya personería (tarea 015). Suelen pedir el certificado de existencia y la validación de un intermediario.

## Qué mirar cada mes

| Indicador | Dónde | Umbral de alerta |
|---|---|---|
| Reportes por día (máximo del mes) | Base | 50 |
| Tamaño de la base | Panel de Supabase | 400 MB |
| Gigabytes de fotos | Panel de R2 | 8 GB |
| Reportes sin validar con más de 7 días | Base | 20 |
| Costo del mes | Facturas | Cualquier valor distinto de cero en la etapa 1 |
