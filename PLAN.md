# Fauna en la Vía — plan maestro

Versión 1, 16 nov 2026. Lo escribió Fable 5.2 con Rubén, a partir de `docs/PROMPT_FABLE_PLAN.md` (versión ajustada por Rubén), de la entrevista del mismo día y de lo medido en el repositorio y en la hoja. Lo que aquí figura como **supuesto** no lo confirmó nadie: hay que confirmarlo o corregirlo.

Documentos que acompañan este plan: [`docs/REDES.md`](docs/REDES.md) (competir, complementar o aliarse), [`docs/ESCALA.md`](docs/ESCALA.md), [`docs/METODO.md`](docs/METODO.md), [`docs/DECISIONES.md`](docs/DECISIONES.md), [`docs/tareas/`](docs/tareas/) y [`CLAUDE.md`](CLAUDE.md).

## 1. Visión

Cualquier persona que ve un animal atropellado en una vía de Colombia lo reporta desde el navegador del celular en menos de un minuto: foto, ubicación, fecha y hora. No instala nada ni crea cuenta. Una IA propone la especie y dice qué tan segura está; una persona del equipo valida. Lo validado alimenta un mapa público, datos abiertos e informes técnicos.

**Para qué:** identificar los tramos donde más fauna muere (hotspots) y señalar cuáles hay que atender primero, con pasos de fauna y otras adecuaciones que reduzcan la mortalidad. Los datos georreferenciados son la prueba ante autoridades, concesionarias y donantes.

**De quién es:** Fauna en la Vía es un proyecto de **Nordeste Salvaje** (Yalí, Antioquia), que está por constituirse como corporación. Rubén es el dueño del proyecto y decide; Alejandro es cocreador y lleva la parte técnica.

**Piloto:** la Autopista al Río Magdalena 2, UF1–UF2 (Remedios, Vegachí, Yalí, Yolombó, Maceo). Es donde ya hay datos, terreno y relaciones. Vienen datos de tres concesiones (Autopista Río Magdalena 2, Vías del Nus y Autopistas del Nordeste) y las coordenadas de todos los PR.

**Para quién es el mapa primero:** la comunidad y quien reporta, la academia y los donantes. Las autoridades y las concesionarias lo usarán, pero no se diseña primero para ellas.

**Frente a las redes que ya existen:** complementar y aliarse, no competir. El detalle y los argumentos están en `docs/REDES.md`.

## 2. Estado de partida (medido el 16 nov 2026)

| Qué | Valor | Cómo se midió |
|---|---|---|
| Registros en la hoja | 106, todos con coordenadas | CSV público de la hoja (gviz), contado con un script |
| Validados | 105 | Columna `Validado` = "Sí" |
| Especies distintas | 58 | Valores únicos de `Especie` |
| Con foto | 85 | `Foto (URL)` con valor |
| Con fecha / con hora | 105 / 103 | Columnas `Fecha` y `Hora` |
| Periodo | 16 sep 2024 – 16 nov 2026 | Mínimo y máximo de `Fecha` |
| Por grupo | 41 aves, 34 reptiles, 26 mamíferos, 2 anfibios, 2 domésticos, 1 invertebrado | Columna `Grupo` |
| Por tramo | UF2 92, UF3 6, VR 4, VDN 3, UF1 1 | Columna `Unidad funcional` |
| La página escribe datos | No | En `index.html` solo hay `fetch` de lectura (hoja y `capas/*.json`) |
| Página publicada | Responde (HTTP 200) en `buflowart.github.io/fauna-en-la-via` | `curl` |
| La hoja se lee sin iniciar sesión | Sí, con todas sus columnas, incluidas `Reportante` (9 filas) y `Notas` (67 filas) | `curl` sin credenciales |

Ritmo de base: 106 registros en 26 meses, unos **4 al mes**. Casi todos son hallazgos oportunistas; no hay recorridos con frecuencia fija.

No se midió: los scripts de `analisis/` no se corrieron (no hay entorno instalado), así que las cifras de bosque de `docs/CONTEXTO.md` siguen siendo memoria de las sesiones anteriores.

## 3. Criterios de éxito

Propuestos a partir de lo que dijo Rubén: más reportes e informes técnicos derivados de los datos. Los números son una propuesta para ajustar.

| Plazo | Reportes | Informes y datos | Organización |
|---|---|---|---|
| **3 meses** (feb 2027) | Reportar funciona desde el celular y guarda. Al menos 30 reportes por la web y 10 personas distintas que reportan | Primer informe técnico del piloto publicado. La hoja maestra ya no es pública | Repositorio en una organización propia. Acuerdo escrito de roles y crédito |
| **6 meses** (may 2027) | 150 reportes nuevos en el semestre (seis veces el ritmo de base). Al menos 1 de cada 4 viene de fuera del círculo conocido. Reportes en al menos 2 corredores más | Segundo informe. Registro de esfuerzo funcionando en un tramo. Exportación en Darwin Core disponible | Corporación constituida (o fecha cierta). Acuerdo de intercambio con Recosfa |
| **12 meses** (nov 2027) | 500 reportes en el año, de al menos 5 departamentos | Cuatro informes (uno por trimestre). Conjunto de datos publicado en SiB Colombia / GBIF y proyecto en iNaturalist. Primer análisis de hotspots con método publicable | Al menos una postulación a fondos presentada. Una red de validadores por grupo taxonómico |

## 4. Frentes de trabajo

### a) Portal web y datos
1. **Dejar de exponer la hoja maestra.** Hoy cualquiera la descarga completa. La página pasa a leer una copia pública con solo las columnas que se decidan publicar (tarea 001).
2. **Modelo de datos** único para registros propios, reportes ciudadanos y datos de concesiones (tarea 003). Requisito mínimo de un registro: coordenadas, fecha y hora. Incluye categoría de amenaza de la UICN y la nacional (Resolución 0126 de 2024 de MinAmbiente), fuente, nivel de confianza de la identificación y estado de validación.
3. **Reportar que guarda** (tarea 006): foto, GPS, especie si se sabe, sin cuenta obligatoria. Comprime la foto y le quita los metadatos EXIF en el celular antes de subirla.
4. **Sin señal** (tarea 008): la página se instala como PWA y guarda el reporte hasta que haya conexión. En el corredor hay tramos largos sin señal: sin esto se pierden reportes.
5. **Identificación y validación** (tarea 007): la IA propone especie y confianza; lo dudoso queda señalado; una persona valida. La IA nunca valida sola. Las especies amenazadas siempre se resaltan y siempre las revisa una persona.
6. **Moderación:** límite de envíos por dispositivo, revisión antes de publicar, descarte de ubicaciones imposibles (fuera de Colombia, lejos de toda vía) y de fotos impropias.
7. **Privacidad de quien reporta:** anónimo por defecto; el nombre se publica solo con permiso expreso. Los datos de contacto nunca se publican y se tratan según la Ley 1581 de 2012.
8. **Ubicación de los registros:** coordenadas exactas para todo (decisión de Rubén, 16 nov 2026; puede cambiar). El modelo de datos guarda aparte la coordenada publicada, para poder difuminar una especie sin migrar nada.
9. **Licencias** de datos y fotos: por decidir (tarea 005). Sin esto no se puede publicar en SiB ni en iNaturalist.
10. **Capas:** pasos de fauna, fauna viva y PR de las vías, cuando lleguen. La capa de conectividad del ocelote es hoy la imagen de un PDF: se reemplaza por capas generadas con SIG o se retira.
11. **Estándar de cada registro** (Guía de pasos de fauna de MinAmbiente 2025): PR de la vía, esfuerzo de muestreo, foto y distancia al paso más cercano, donde aplique.

### a2) Escala y servidores
Ver `docs/ESCALA.md`. En corto: se empieza gratis, con base PostgreSQL/PostGIS y fotos en almacenamiento compatible con S3, para poder cambiar de proveedor sin rehacer.

### b) Ciencia
1. **Decir lo que los datos permiten.** Son registros reportados y oportunistas: sirven para decir dónde y qué se ha encontrado, no cuántos animales mueren ni qué tramo es peor por kilómetro.
2. **Registrar el esfuerzo** (tarea 010): cada recorrido se anota aunque no se encuentre nada (fecha, tramo, quién, cómo). Es lo más barato que se puede hacer hoy y lo que más cambia lo que se podrá afirmar.
3. **Un tramo con protocolo** (tarea 011): un recorrido periódico en un tramo corto, según la guía de MinAmbiente, para tener una tasa defendible aunque sea en un solo sitio.
4. **Hotspots** (tarea 012): método publicable sobre la vía como línea, con los registros ubicados por PR y corregidos por esfuerzo donde lo haya. **El método está por definir**: hay un borrador en `docs/METODO_HOTSPOTS.md`, pendiente de sustentarlo con literatura (decisión 20).
5. **Persistencia de carcasas:** un cuerpo puede durar más de una semana en la vía. Dos fotos de la misma especie en el mismo punto pueden ser el mismo animal; se revisa caso a caso antes de contar dos.
6. **Conectividad:** corredores de menor costo con capas propias, validados en terreno. Después de los hotspots.

### c) Vía legal
La lleva Nordeste Salvaje con sus propios documentos y **no se planea en este repositorio**, que es público. Lo que el proyecto necesita de este frente: que los datos de concesiones y autoridades que lleguen por derecho de petición entren a la plataforma con su fuente (tarea 009), y que los informes técnicos sirvan de soporte. Rubén ya es tercero interviniente en el expediente LAV0017-00-2016 y ya hay peticiones en curso; lo que dicen sobre esto `docs/CONTEXTO.md` y `reports/` está desactualizado.

### d) Organización y financiación
1. Constituir la corporación Nordeste Salvaje (meta de Rubén: 2026). De eso dependen los convenios, casi todos los fondos, ser publicador en SiB y los créditos gratuitos para ONG.
2. Acuerdo escrito de roles y crédito entre Rubén y Alejandro como cocreadores (tarea 014).
3. Organización propia en GitHub y traslado del repositorio (tarea 002).
4. Aliados: Recosfa/ITM (relación iniciada), universidades para aval y validadores por grupo.
5. Calendario de convocatorias: parte de `reports/Financiación fauna atropellada Antioquia.md`, que hay que releer sabiendo que sí habrá personería y que el objetivo ya no es solo el ocelote (tarea 015).

### e) Comunicación y campañas
1. Mensaje simple: "¿Viste un animal atropellado? Repórtalo en un minuto, sin instalar nada."
2. Primero el corredor piloto (grupos de WhatsApp, conductores, transportadores, juntas de acción comunal), después otros corredores con aliados locales.
3. Devolverle algo a quien reporta: qué especie era, y que su reporte quedó en el mapa.
4. Aviso antes de mostrar fotos fuertes.
5. La página se abre a buscadores (hoy tiene `noindex`) cuando la hoja ya no esté expuesta y las licencias estén decididas.

## 5. Hitos y ruta crítica

| Fecha | Hito | Depende de |
|---|---|---|
| 30 nov 2026 | La hoja maestra deja de ser pública; la página lee la copia filtrada | Tarea 001 |
| 30 nov 2026 | Repositorio en la organización propia; Rubén con acceso | Tarea 002 |
| 15 dic 2026 | Modelo de datos y licencias decididos | Tareas 003, 004, 005 |
| 31 ene 2027 | Reportar guarda de verdad; cola de validación con IA | Tareas 006, 007 |
| 15 feb 2027 | Primer informe técnico del piloto | Tarea 013 |
| 28 feb 2027 | Funciona sin señal; registro de esfuerzo en uso | Tareas 008, 010 |
| mar 2027 | Primera campaña en el corredor piloto | Reportar estable; licencias |
| abr 2027 | Datos de concesiones cargados con su fuente; capa de PR | Tarea 009; respuestas a las peticiones |
| may 2027 | Segundo informe; exportación Darwin Core | Tarea 016 |
| jun–ago 2027 | Segundo y tercer corredor con aliados | Campaña; validadores |
| sep 2027 | Publicación en SiB/GBIF y proyecto iNaturalist | Corporación; licencias; tarea 016 |
| nov 2027 | Análisis de hotspots; cuarto informe | Tareas 010, 011, 012 |
| dic 2027 | Revisión del plan y plan 2028 | — |

**Ruta crítica:** datos públicos filtrados → modelo de datos → reportar que guarda → validación → campaña → volumen de reportes → hotspots e informes. Todo lo que retrase "reportar que guarda" retrasa lo demás.

**Segunda cadena, de organización:** corporación constituida → publicador en SiB, convenios, fondos y créditos para ONG. No bloquea el desarrollo, pero sí la publicación formal y la plata.

## 6. Riesgos

| Riesgo | Qué tan probable | Mitigación |
|---|---|---|
| Datos personales o notas internas expuestos (ya pasa con la hoja) | Ocurriendo | Tarea 001, la primera. Lista blanca de columnas, nunca lista negra |
| Pocos reportes: la gente no se entera o no vuelve | Alta | Campaña en el piloto antes de crecer; reporte en menos de un minuto; devolverle algo a quien reporta |
| Que Recosfa lo vea como competencia | Media | Hablar antes de lanzar; ofrecer intercambio de datos; decirlo en la página |
| Afirmar más de lo que los datos permiten | Media | Reglas de `CLAUDE.md` y listas de revisión de `docs/METODO.md` |
| Coordenadas exactas de especies sensibles | Baja hoy, sube con el volumen | El modelo permite difuminar por especie sin migrar; revisar la decisión cada seis meses |
| Reportes falsos, spam o fotos impropias | Media al crecer | Nada se publica sin validar; límites de envío |
| Fotos de terceros sin permiso de uso | Media | Aceptación de licencia al reportar; permiso para las fotos que ya hay |
| Un solo responsable técnico | Alta | Tareas autocontenidas, `CLAUDE.md`, exportación completa de los datos |
| El proveedor gratuito cambia las condiciones | Media | Base y almacenamiento estándar; exportación mensual |
| Poco tiempo (unas 10 horas a la semana) | Cierta | Pocas tareas a la vez; lo mecánico, a agentes |
| Se acaba el acceso a Fable | Cierta | Este plan y `docs/METODO.md` |

## 7. Decisiones abiertas

| Decisión | Quién | Para cuándo |
|---|---|---|
| Qué columnas de la hoja se publican | Rubén | Decidido el 16 nov 2026 (decisiones 19 y 21). Falta confirmar si va la estructura más cercana |
| Con qué literatura se define el método de hotspots | Rubén | Sin fecha |
| Licencia de datos y de fotos | Rubén, consultando a Alejandro | 15 dic 2026 |
| Arquitectura inicial (propuesta en `docs/ESCALA.md`) | Alejandro, con visto bueno de Rubén | 15 dic 2026 |
| Nombre y dueños de la organización en GitHub | Rubén y Alejandro | 30 nov 2026 |
| Texto del acuerdo de cocreadores | Rubén y Alejandro | 31 dic 2026 |
| Qué se le propone a Recosfa | Rubén | Antes de lanzar Reportar |
| Qué hacer con la capa del ocelote | Rubén | 15 dic 2026 |
| Si las horas disponibles son 10 por persona o entre los dos | Rubén | 23 nov 2026 |

## 8. Supuestos sin confirmar

- Las 10 horas a la semana son por persona.
- La corporación queda constituida entre diciembre de 2026 y el primer trimestre de 2027.
- Alejandro está de acuerdo con que el proyecto sea de Nordeste Salvaje y con figurar como cocreador. Rubén lo va a validar con él.
- Recosfa acepta intercambiar datos. La relación apenas empieza.
- Las fotos que mandaron terceros se pueden publicar. No hay permiso escrito.
