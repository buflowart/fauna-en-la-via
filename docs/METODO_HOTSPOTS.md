# Método para identificar hotspots con registros oportunistas

Versión 0.1, 16 nov 2026. Propuesta de Fable 5.2 para el diseño de las tareas 010, 011 y 012. Es un diseño, no un resultado: los números de la sección 2 son una exploración para entender los datos, no un análisis de hotspots.

## 1. El problema, en una frase

Un mapa de registros oportunistas muestra **dónde murieron animales y además alguien pasó, los vio y los reportó**. Un hotspot calculado sin más sobre esos puntos puede estar señalando el tramo más recorrido, no el más peligroso.

El método tiene que separar, hasta donde se pueda, esas dos cosas. Y tiene que decir con honestidad cuándo no se puede.

## 2. Qué muestran hoy los datos del piloto

Medido el 16 nov 2026 sobre la hoja pública. Para explorar, la UF2 se cortó en franjas de latitud, porque corre casi de sur a norte. Eso es una aproximación gruesa: el análisis real va sobre el eje de la vía (sección 5).

- **92 registros en la UF2**, sobre unos 30 km; 91 con fecha. De esos 91: 39 aves, 27 reptiles, 21 mamíferos, 2 anfibios, 1 doméstico y 1 invertebrado.
- **El esfuerzo no fue parejo en el tiempo.** Febrero de 2025 tiene 24 registros en 9 días distintos; entre marzo de 2025 y julio de 2026 hubo 31 en diecisiete meses; entre agosto y noviembre de 2026, 30 en cuatro meses. Es muy poco probable que la mortalidad haya cambiado así: lo que cambió fue cuánto se buscó.
- **Tampoco en el espacio.** Entre las latitudes 6.53 y 6.62 (unos 10 km) está cerca del 60 % de los registros. Al norte de 6.71 casi no hay.
- **La concentración del sur aparece en los tres periodos con datos**, no solo en el pico de febrero de 2025. Eso es un indicio a favor de que sea real, pero no una prueba: si quienes reportan pasan más por ahí en todos los periodos, el patrón se repite por la misma razón.
- **Solo 8 registros de la UF2 tienen reportante anotado.** No se puede reconstruir quién buscó dónde.
- **Por día de la semana** tampoco es parejo (23 en jueves, 3 en viernes): otra huella del esfuerzo.

**Lo que hoy se puede decir:** "entre tal y tal PR se concentra la mayoría de los registros, y esa concentración se mantiene en distintos periodos". **Lo que no:** que ese tramo sea más peligroso que el norte de la UF2, donde no se sabe cuánto se ha buscado.

## 3. Tres niveles de evidencia

Todo resultado dice a qué nivel pertenece.

| Nivel | Datos | Qué permite afirmar | Qué no |
|---|---|---|---|
| **1. Presencia** | Registros oportunistas sin esfuerzo (lo de hoy) | Qué especies mueren, dónde se han encontrado, agrupamientos de registros, especies amenazadas afectadas, distancia a los pasos existentes | Comparar tramos o épocas; tasas; "el peor tramo" |
| **2. Esfuerzo conocido** | Registros enlazados a recorridos anotados, con los recorridos sin hallazgos incluidos (tarea 010) | Registros por kilómetro recorrido; comparar tramos y épocas con igual esfuerzo; hotspots corregidos por esfuerzo | Mortalidad real (no se ve todo lo que muere) |
| **3. Protocolo** | Recorridos periódicos en un tramo, con método fijo (tarea 011), y pruebas de detección y persistencia | Tasa de mortalidad estimada con su incertidumbre; cambios en el tiempo; efecto de una medida | Extrapolar a tramos sin protocolo |

El salto del nivel 1 al 2 cuesta casi nada: anotar cada salida. Es la mejor inversión del proyecto.

## 4. Antes de analizar: limpiar

1. **Un animal, un registro.** Revisar las parejas de la misma especie a menos de unos 50 m y con menos de quince días de diferencia. Una carcasa grande puede durar más de una semana; una pequeña suele desaparecer en uno o dos días (Santos et al. 2011 encontraron una mediana de un día para el conjunto de vertebrados, con menos persistencia en animales pequeños). La decisión la toma una persona y queda en la tabla `cruce`.
2. **Solo atropellados y lesionados.** La fauna viva es otra capa.
3. **Solo registros en la vía analizada.** Los `VR-` (vías rurales) se analizan aparte.
4. **Registros de otras fuentes, aparte primero.** Los de una concesión tienen su propio esfuerzo (recorridos de mantenimiento). Se analizan por separado y después se comparan; no se suman a ciegas.
5. **Fecha y hora.** Los registros incompletos sirven para el dónde, no para el cuándo.

## 5. Ubicar cada registro sobre la vía

El análisis se hace en **una dimensión**: la distancia a lo largo del eje de la vía. En dos dimensiones, una curva o una vía paralela crean agrupamientos falsos.

1. Tener el eje de la vía como línea (de OpenStreetMap o del trazado oficial) y los PR con sus coordenadas.
2. Proyectar cada registro al punto más cercano del eje y guardar su posición en metros desde el PR 0.
3. Descartar o revisar los que queden a más de unos 30 m del eje: o no son de esa vía o la coordenada está mal.
4. Trabajar en un sistema de coordenadas en metros, no en grados.

## 6. Encontrar los agrupamientos

**Método propuesto: KDE+.** Es una estimación de densidad por núcleo sobre la línea, a la que se le agrega una prueba de significancia: compara la densidad observada con la que saldría de repartir los mismos registros al azar muchas veces, y se queda solo con los agrupamientos que superan ese umbral. Además los ordena por fuerza. Es de uso libre, está publicado y se aplicó a toda la red vial checa (Bíl et al., *Landscape Ecology*, DOI 10.1007/s10980-015-0265-6).

**Contraste: Siriema.** Programa libre brasileño, muy usado en América Latina. Usa la K de Ripley sobre la línea para saber a qué escala se agrupan los registros, y un análisis de hotspots con límites de confianza por simulación. Sirve para comprobar que el resultado no depende del programa. **La referencia exacta del manual no se pudo verificar hoy**: buscarla antes de citarla.

Por qué KDE+ primero: da agrupamientos con inicio y fin (un tramo de vía, que es lo que se le puede pedir a alguien que intervenga), los ordena, y no exige elegir a ojo un umbral.

**Parámetros a fijar y a reportar siempre:**
- Ancho de banda del núcleo. Probar al menos tres (por ejemplo 100, 250 y 500 m) y reportar qué agrupamientos sobreviven a los tres. El valor usual en la literatura de KDE+ hay que tomarlo del artículo, no de memoria.
- Número de simulaciones (al menos 1.000) y nivel de significancia.
- Longitud de la vía analizada.

**Cuántos registros hacen falta.** Criterio propio, a revisar con un aliado académico: con menos de unos 30 registros en una vía, el resultado es inestable y no se publica como hotspot. Hoy eso deja:
- UF2, todos los grupos (92): **sí se puede explorar**.
- UF2 por grupo (39 aves, 27 reptiles, 21 mamíferos): solo como ejercicio, sin conclusiones.
- UF1, UF3, Vías del Nus y vías rurales: no alcanza.

## 7. El punto débil: contra qué se compara

KDE+ y Siriema comparan contra un reparto **uniforme**: suponen que cualquier metro de la vía tenía la misma probabilidad de producir un registro. Con datos oportunistas eso es falso, y es la razón por la que un hotspot puede ser solo un tramo muy visitado.

Tres defensas, de la más barata a la mejor:

### a) Pruebas de robustez (se pueden hacer hoy)
Repetir el análisis quitando partes de los datos y ver qué agrupamientos sobreviven:
- sin el mes de más registros (febrero de 2025);
- por separado en cada periodo (hasta julio de 2026, y desde agosto de 2026);
- sin los registros del reportante más activo, cuando se sepa quién es;
- solo con mamíferos medianos y grandes, que se ven desde un vehículo y duran más en la vía, por lo que dependen menos de quién pasó y cuándo.

Un agrupamiento que aparece en todas las versiones se reporta como **consistente**. Uno que aparece solo en algunas, como **preliminar**. Esto no prueba nada sobre el esfuerzo, pero descarta los artefactos más obvios.

### b) Comparar contra el esfuerzo (cuando haya recorridos anotados)
Cambiar el reparto al azar: en vez de uniforme, proporcional a los kilómetros recorridos en cada segmento. Un tramo recorrido diez veces más "espera" diez veces más registros, y solo es hotspot si tiene más que eso.

Ni KDE+ ni Siriema lo hacen tal cual, hasta donde se pudo ver. Hay que programarlo: es la misma simulación, con pesos. Unas pocas decenas de líneas en Python sobre las posiciones lineales. **Esta es la pieza propia del método y hay que hacerla revisar por alguien de estadística espacial antes de publicar con ella.**

Mientras no haya recorridos anotados, un sustituto pobre pero mejor que nada: usar como esfuerzo los **días con al menos un registro** por segmento, sabiendo que subestima (no cuenta las salidas sin hallazgos).

### c) Un tramo con protocolo (tarea 011)
Es lo único que da una tasa. Sirve además para calibrar: si en el tramo con protocolo los agrupamientos coinciden con los que salían de los datos oportunistas, hay razones para confiar más en estos en otros tramos.

## 8. De registros a mortalidad: lo que falta

Aun con protocolo, lo que se cuenta es menos de lo que muere. Dos correcciones, las dos conocidas en la literatura (Santos et al. 2011, *PLoS ONE* 6(9): e25383; Teixeira et al. 2013, *Biological Conservation*, **referencia por verificar**):

- **Persistencia:** cuánto dura una carcasa antes de desaparecer. Se mide marcando carcasas y volviendo.
- **Detección:** qué fracción de las carcasas presentes ve quien recorre. Depende del medio (a pie se ve mucho más que en carro) y del tamaño del animal.

El proyecto no necesita esto para identificar hotspots. Lo necesita si algún día quiere decir "mueren tantos animales al año". Hasta entonces, esa frase no se dice.

## 9. Qué se entrega

Para cada vía analizada:

1. **Las limitaciones primero**, en un recuadro: nivel de evidencia, periodo, número de registros, qué se sabe del esfuerzo.
2. **Tabla de agrupamientos:** PR de inicio y de fin, longitud, número de registros, fuerza, si es consistente o preliminar, grupos y especies, especies amenazadas, paso de fauna más cercano y su distancia.
3. **Mapa** con los agrupamientos sobre el eje, los registros y los pasos de fauna.
4. **Tramos sin información:** los segmentos donde no hay registros **ni** esfuerzo conocido se pintan como "sin datos", no como "sin atropellamientos". Es tan importante como los hotspots.
5. **Parámetros y código** para reproducirlo.

## 10. De hotspot a prioridad

El objetivo del proyecto es decir qué zonas hay que atender primero. Un hotspot es un insumo; la prioridad junta más cosas. Propuesta de ficha por tramo, sin fórmula oculta:

| Criterio | Cómo se mide |
|---|---|
| Concentración de registros | Fuerza del agrupamiento y si es consistente |
| Especies amenazadas | Número de registros de especies CR, EN o VU (UICN o Res. 0126 de 2024) |
| Grupos afectados | Arborícolas, terrestres medianos y grandes, reptiles, anfibios: cada uno pide una medida distinta |
| Medidas existentes | Distancia al paso de fauna más cercano del tipo que serviría, y si funciona |
| Paisaje | Bosque a los dos lados de la vía (con las reservas de cada fuente de cobertura) |
| Seguridad vial | Animales grandes en la calzada; curvas; velocidad |

Se presenta como tabla, con cada criterio a la vista, para que quien decide vea por qué un tramo queda arriba. No se reduce a un solo número: un índice esconde justamente lo que hay que discutir.

**Que un tramo tenga muchos registros cerca de un paso de fauna no prueba que el paso no funcione.** Puede ser que el paso esté donde más animales cruzan. Esa pregunta necesita datos de uso del paso (cámaras trampa), no solo de atropellamientos.

## 11. Cuándo hacer cada cosa

| Cuándo | Qué |
|---|---|
| Ya | Anotar cada recorrido (tarea 010). Revisar duplicados. Conseguir el eje de la UF2 y los PR |
| Con el eje y los PR | Exploración de nivel 1 en la UF2 con KDE+ y las pruebas de robustez. Sale en el primer informe técnico como "concentración de registros", con las limitaciones delante |
| Con tres meses de recorridos | Primer análisis corregido por esfuerzo. Comparar con el anterior |
| Con unos 300 registros o un año | Análisis por grupo. Contraste con Siriema. Revisión de un aliado académico |
| Con los datos de las concesiones | Análisis aparte de esos registros y comparación con los propios |
| Con seis meses de protocolo | Primera tasa en el tramo con protocolo |

## 12. Preguntas para Rubén

Cambian la interpretación y solo él las puede contestar:

1. ¿Qué pasó en febrero de 2025? (24 registros en 9 días distintos.) ¿Hubo recorridos a propósito?
2. ¿Por qué casi no hay registros al norte de la latitud 6.71, hacia Vegachí? ¿Se pasa menos por ahí?
3. ¿Quiénes reportan y por dónde se mueven de costumbre? No hace falta escribir nombres: basta con saber cuántas personas y qué tramos.
4. ¿Los registros salen de ir buscando o de ir de paso? ¿En qué medio?
5. ¿La concesionaria retira las carcasas? ¿Con qué frecuencia y a qué hora pasa?

## 13. Referencias y su estado

| Referencia | Estado |
|---|---|
| Bíl, M. et al. *The KDE+ software: a tool for effective identification and ranking of animal-vehicle collision hotspots along networks.* Landscape Ecology. DOI 10.1007/s10980-015-0265-6 | Verificada la existencia y el DOI (16 nov 2026). Año, volumen y páginas: tomar de la página de la revista |
| Santos, S. M., Carvalho, F. y Mira, A. (2011). *How long do the dead survive on the road? Carcass persistence probability and implications for road-kill monitoring surveys.* PLoS ONE 6(9): e25383 | Verificada (16 nov 2026) |
| Siriema, programa de análisis de mortalidad en carreteras (UFRGS, Brasil) | **Sin verificar.** Buscar el manual y la cita correcta |
| Teixeira, F. Z. et al. (2013). Estimación de mortalidad de vertebrados: efecto del método de muestreo y de la remoción de carcasas. Biological Conservation | **Sin verificar.** Citada de memoria |
| Comparación de ciencia ciudadana y patrullas en una autopista de Sudáfrica (Frontiers in Ecology and Evolution, 2018, DOI 10.3389/fevo.2018.00015) | Vista solo en resumen. Concluye que los reportes ciudadanos sirven para patrones generales y zonas de riesgo. Leerla completa |
| Guía de pasos de fauna de MinAmbiente (versión 2025) | Citada desde `reports/`. Leer el texto antes de escribir el protocolo |
