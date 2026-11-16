# Registro de decisiones

Una fila por decisión. Las nuevas van al final. Si una decisión cambia, no se borra: se agrega otra que la reemplaza y se dice cuál.

| # | Fecha | Decisión | Alternativas descartadas | Por qué | Quién |
|---|---|---|---|---|---|
| 1 | 2026-11-12 | El objetivo pasa de un mapa del corredor a una plataforma nacional de ciencia ciudadana; la Autopista al Río Magdalena 2 es el piloto | Quedarse en el corredor | El método sirve para cualquier vía y el volumen de datos mejora los análisis | Rubén y Alejandro |
| 2 | 2026-11-12 | El portal es una página web, no una app | App nativa | Nadie instala una app para algo que le pasa de vez en cuando | Alejandro, con Rubén |
| 3 | 2026-11-16 | Fauna en la Vía es un proyecto de Nordeste Salvaje; Rubén es el dueño y Alejandro, cocreador con la parte técnica | Iniciativa aparte de los dos | Nordeste Salvaje ya tiene el territorio, los datos y las relaciones, y será la que firme y postule. Pendiente de validar con Alejandro | Rubén |
| 4 | 2026-11-16 | Objetivo de fondo: identificar hotspots para priorizar las zonas a atender, con pasos de fauna y otras adecuaciones | "Conseguir pasos de fauna" como único fin | Los pasos son una de varias medidas; primero hay que saber dónde | Rubén |
| 5 | 2026-11-16 | Público principal del mapa: comunidad y quienes reportan, academia y donantes | Diseñarlo primero para autoridades o concesionarias | De ellos dependen el volumen de reportes, el aval y los recursos | Rubén |
| 6 | 2026-11-16 | Frente a las redes existentes: complementar y aliarse | Competir; o no tener plataforma y usar solo las existentes | Ver `docs/REDES.md` | Rubén, con la recomendación de Fable |
| 7 | 2026-11-16 | Un registro se acepta si tiene coordenadas, fecha y hora, venga de donde venga | Aceptar solo registros con foto, o solo los propios | Permite sumar datos de concesiones y de otras redes. La foto sigue siendo necesaria para validar la especie | Rubén |
| 8 | 2026-11-16 | Las coordenadas se publican exactas para todas las especies. Puede cambiar | Difuminar las de especies sensibles desde el inicio | Para el análisis de la vía la coordenada exacta es el dato. El modelo de datos debe permitir difuminar por especie sin migrar | Rubén |
| 9 | 2026-11-16 | Quien reporta es anónimo por defecto; su nombre se publica solo con permiso. La columna `Reportante` sale de lo público | Publicar el nombre como crédito por defecto | Protección de datos personales y seguridad de quien reporta | Rubén |
| 10 | 2026-11-16 | Validación: la IA propone especie y nivel de confianza y señala lo dudoso; una persona valida. Al comienzo valida Rubén | Validación solo humana; o IA sin revisión | Es lo que ya se hace en el piloto y es lo único que da abasto con 10 horas a la semana | Rubén |
| 11 | 2026-11-16 | Todo registro lleva la categoría de la UICN y la de la Resolución 0126 de 2024 de MinAmbiente; las amenazadas siempre se resaltan | Solo UICN | La categoría nacional es la que vale ante las autoridades colombianas | Rubén |
| 12 | 2026-11-16 | Los datos de las concesiones se piden por derecho de petición, mientras las relaciones no permitan otra vía | Esperar entrega voluntaria | Es la vía disponible hoy | Rubén |
| 13 | 2026-11-16 | Los datos validados se publicarán más adelante en iNaturalist y en SiB Colombia / GBIF | Mantenerlos solo en la plataforma | Alcance, cita y aval | Rubén |
| 14 | 2026-11-16 | La vía legal no se planea ni se documenta en este repositorio | Tener aquí la estrategia y los borradores | El repositorio es público y lo puede leer cualquiera, incluidas las partes | Fable; pendiente de visto bueno de Rubén |
| 15 | 2026-11-16 | La página deja de leer la hoja maestra y lee una copia pública filtrada por lista blanca de columnas | Seguir leyendo la hoja en vivo; o quitar solo la columna de nombres | La hoja expone hoy nombres de reportantes y notas internas a cualquiera | Rubén (copia filtrada). Falta definir las columnas |
| 16 | 2026-11-16 | Propuesta de arquitectura para la etapa 1: sitio estático, base PostgreSQL/PostGIS en Supabase y fotos en Cloudflare R2, todo en planes gratuitos | Escribir en la hoja con Apps Script; Firebase; todo en Cloudflare | Estándares abiertos, costo cero y migración simple. Ver `docs/ESCALA.md`. **Propuesta: la decide Alejandro con Rubén** | Fable |

## Decisiones abiertas

Están en la sección 7 de `PLAN.md`, con quién decide y para cuándo.
