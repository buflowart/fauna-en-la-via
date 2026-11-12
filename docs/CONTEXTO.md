# Contexto: lo que ya se hizo y se encontró (hasta 2026-11-12)

Resumen para cualquier persona o agente que entra al proyecto sin historia. Lo escribió Alejandro con Claude a partir
de las sesiones de trabajo del 9 y el 12 de noviembre de 2026. Lo que dice acá es **memoria de esas sesiones**:
verificalo contra el repo y la hoja antes de usarlo como dato.

## Quiénes

- **Rubén** — ingeniero agrónomo, dueño del proyecto. Datos, terreno, contactos.
- **Alejandro** — le propuso la idea de la plataforma, cofundador, parte técnica.

## Objetivo (cambió el 12-nov-2026)

Antes: mapa de los atropellos en una autopista. Ahora: **plataforma nacional** de ciencia ciudadana donde cualquiera
reporta fauna atropellada desde una **página web** (no una app). La Autopista al Río Magdalena 2, UF1–UF2 (Remedios,
Vegachí, Yalí, Yolombó, Maceo; Antioquia) queda como **piloto**. Fin último: pasos de fauna y menos mortalidad.

## El prototipo actual

- `index.html`: una sola página con Leaflet + OpenStreetMap + satélite Esri; la carretera viene de OSRM. Lee en vivo la
  hoja de Google de Rubén (CSV por gviz). Los botones Reportar y Validar **no escriben todavía** en ninguna parte.
- Publicado de forma temporal en `buflowart.github.io/fauna-en-la-via` (cuenta de la marca de Alejandro, con noindex).
  Se va a mudar a una organización propia del proyecto (ver `TRABAJAR_JUNTOS.md`).

## Datos

- Hoja de Google de Rubén: **102 registros**, 101 con coordenadas, 94 validados, 52 especies, 81 con foto en Drive.
  La columna `Hora` es la hora del registro.
- Son fotos de Rubén y de conocidos: **registros reportados, no el total de animales muertos**. Hay sesgo de muestreo.
- De un PDF de Rubén: 72 atropellos entre dic-2024 y 2026, 3 de ellos ocelotes. La pág. 11 tiene un mapa completo con
  coordenadas que todavía no se pasó al mapa.

## Capas del mapa

1. **Solo registros.**
2. **Conectividad del ocelote** — sale de una diapositiva del estudio de Laura Camila Cuevas Moreno, "Identificación de
   corredores de movilidad para el ocelote… UF1–UF2" (curso de Ecología del Paisaje 2026-II; Linkage Mapper +
   MapBiomas 2024; buffer de 10 km). Se ubicó a mano sobre el mapa usando los registros y la carretera: error ~50 m.
   Verde = corredor (costo bajo), rojo = costo alto, azul claro = núcleos ≥ 200 ha. **Es ilustrativa**: faltan los
   rasters originales, la leyenda y el permiso de la autora.
3. **Bosque y carretera** — dos fuentes: IDEAM bosque natural 2025 (por defecto) y Hansen Global Forest Change
   2000–2024. Se generan con los scripts de `analisis/`.

## Hallazgos del análisis de bosque

Corredor de 10 km a cada lado de 80 km de vía.

- **IDEAM**: 37.520 ha de bosque natural (21 %). 12,5 % a menos de 500 m de la vía, contra 23,7 % entre 5 y 10 km.
- **Hansen**: 111.239 ha (63 %). Sobreestima (rastrojo, potreros arbolados, plantaciones). Las dos fuentes coinciden en
  el 92 % del bosque del IDEAM; el 85 % de la diferencia está en manchas de más de 100 ha.
- Pérdida anual cerca / lejos de la vía (Hansen): 0,86 / 0,92 % en 2001–12 y 1,23 / 1,01 % en 2013–24. La obra fue
  2016–2025 y la operación arrancó en 2025: **coincide en el tiempo, no prueba causa**.
- Mirando el satélite, hasta el IDEAM se equivoca en algunos lugares: **ninguna fuente da certeza total**.

## Financiación y vía legal (detalle en `reports/` y `research_notes/`)

- **Palanca principal: la licencia ambiental de la ANLA** (Res. 763/2016, expediente LAV0017-00-2016, UF1–UF2).
  Cuesta solo derechos de petición, solicitud de tercero interviniente y una queja técnica con los registros como prueba.
- **Primer paso clave:** pedir a la ANLA copia del expediente para ver si la licencia ya obliga a monitorear el
  atropellamiento y la eficacia de los pasos de fauna.
- **Cuello de botella: no hay personería jurídica.** Casi todos los fondos públicos y multilaterales la exigen.
- Fondos que no la exigen: Rufford Small Grants, Idea Wild, WILDLABS.
- Aliados posibles: Corantioquia (autoridad ambiental de la zona), Recosfa / ITM (red nacional de fauna atropellada),
  UdeA (aval científico).
- El ocelote es Preocupación Menor (UICN): conviene presentar el proyecto como conectividad, seguridad vial y
  mortalidad de toda la fauna, con el ocelote como especie paraguas.
- Estándar para cada registro (Guía de pasos de fauna de MinAmbiente 2025): PR de la vía, esfuerzo de muestreo, foto,
  distancia al paso más cercano.

## Ideas pendientes que ya estaban sobre la mesa

Escribir los reportes en una base; pasar el mapa de la pág. 11 del PDF; mapa de certeza del bosque (seguro/dudoso);
validación en terreno; corredores de menor costo (Circuitscape, Linkage Mapper); hotspots con Siriema o KDE+; campañas
para que la gente reporte; referente: corredor de vida silvestre de Florida.

## Fuentes

- IDEAM SMByC: https://bart.ideam.gov.co/smbyc/
- Hansen et al. 2013, Science 342: 850–853
- MapBiomas Colombia: https://colombia.mapbiomas.org/
