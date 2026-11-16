# Modelo de datos

Versión 0.1, 16 nov 2026. Propuesta de Fable 5.2 para la tarea 003. El esquema está en [`db/esquema.sql`](../db/esquema.sql). **No se ha ejecutado contra una base**: lo primero al retomarlo es correrlo en una base de prueba y cargar la hoja del piloto (sección 8).

Se diseñó mirando las cinco pestañas de la hoja del piloto (Registros, Fauna viva, Pasos de fauna, Registros ARM y Cruce ARM) y las decisiones 7 a 13 de `DECISIONES.md`.

## 1. Las ideas que sostienen el modelo

1. **Un registro es un animal en un lugar y un momento, venga de donde venga.** Los registros de Nordeste Salvaje, los reportes ciudadanos y los de una concesión viven en la misma tabla y se distinguen por su fuente.
2. **Lo privado y lo público están separados en la base, no en la página.** La página y las exportaciones leen solo las vistas públicas. Quien reporta, las notas internas y la coordenada real nunca están en ellas. Un error en la página no puede filtrar lo que la vista no entrega.
3. **Nada se sobrescribe.** La especie que dijo quien reportó, la que propuso la IA y la que validó una persona se guardan como historial. El registro apunta a la validada.
4. **Lo que se puede calcular no se escribe a mano.** El PR, la estructura más cercana, la distancia, el municipio y la coordenada publicada salen de la geometría.
5. **Lo que puede cambiar tiene dónde cambiar.** Difuminar la ubicación de una especie es cambiar un número en su ficha, no migrar datos.

## 2. Las tablas

| Tabla | Qué guarda | Pública |
|---|---|---|
| `fuente` | De dónde viene un registro: Nordeste Salvaje, reporte ciudadano, cada concesión, cada red | Solo el nombre |
| `taxon` | Especie (o grupo, cuando no se pudo identificar), con las dos categorías de amenaza | Sí |
| `persona` | Quien reporta y quien valida | **Nunca** |
| `via`, `tramo`, `pr` | La vía, sus unidades funcionales y sus puntos de referencia | Sí |
| `estructura` | Pasos de fauna, viaductos y obras hidráulicas | Sí |
| `recorrido` | Cada salida a la vía, aunque no se encuentre nada | Solo agregado por mes |
| `registro` | El animal: dónde, cuándo, qué, de qué fuente, en qué estado de validación | Solo los validados, por la vista |
| `foto` | Las fotos de cada registro | Solo las que tienen permiso |
| `identificacion` | Historial de propuestas de especie | No |
| `cruce` | Parejas de registros que pueden ser el mismo animal | No |

## 3. Decisiones de diseño que hay que conocer

### Dos coordenadas
`registro.geom` es la real. `registro.geom_publica` es la que sale, y la calcula la base. Hoy son iguales para todas las especies (decisión 8). Si un día se decide proteger una especie, se pone un valor en `taxon.difuminar_m` (por ejemplo, 5000) y sus registros salen redondeados a una cuadrícula de ese tamaño. Se redondea en vez de sumar ruido al azar porque el ruido se puede promediar para recuperar el punto.

### La fuente va aparte del código
El código `ARM-UF2-036` es de un registro **de Nordeste Salvaje** hecho en la concesión Autopista Río Magdalena. Un registro **de la concesionaria** tiene `fuente` = la concesión e `id_origen` = "ARM No. 79". La pareja (`fuente`, `id_origen`) es única: cargar dos veces el mismo archivo no duplica.

### Tres tipos de registro en una tabla
`atropellado`, `lesionado` y `vivo`. Los lesionados son consecuencia del mismo evento y se analizan con los atropellados. La fauna viva lleva sus campos propios (dónde estaba, qué hacía, resultado) en `detalle`, y conserva su prefijo `VIV-` para que nunca se confunda con un atropello. Los análisis de mortalidad filtran por tipo.

### Estados
`recibido` → `en_revision` → `validado`, `dudoso`, `rechazado` (con motivo) o `duplicado` (apunta al registro original). Solo `validado` es público. La base no deja validar un registro sin especie, ni marcar un duplicado sin decir de cuál.

### Registro completo
La decisión 7 pide coordenadas, fecha y hora. La coordenada es obligatoria. La fecha y la hora no se imponen, porque el piloto tiene registros validados sin hora (3) y sin fecha (1). La base marca `completo` y los análisis en el tiempo usan solo esos.

### Taxón "sin identificar"
"Ave sin identificar" o "*Micrurus* sp." son taxones con `rango` distinto de especie (clase, orden, género). Así un registro siempre apunta a algo, y los conteos por especie los pueden excluir.

### Categorías de amenaza
`taxon.uicn` (con fecha de consulta y enlace) y `taxon.nacional` (Resolución 0126 de 2024). Como la resolución usa a veces otro nombre, se guarda `nombre_en_res_0126`. Caso ya encontrado: el tití gris está en la base como *Oedipomidas leucopus* y en la resolución como *Saguinus leucopus* (VU). Un taxón es "amenazado" si es CR, EN o VU en cualquiera de las dos listas. NT no cuenta como amenazado.

### Quien reporta
`persona` guarda nombre y contacto solo si los dio. El crédito público depende de `credito_publico`, que es falso por defecto (decisión 9). Las vistas públicas solo muestran `nombre_credito` cuando hay permiso.

### Fotos
Se guarda la **ruta** del objeto, no la URL del proveedor: cambiar de almacenamiento no toca los registros. `url_externa` existe para las fotos que siguen en Drive durante la transición. Toda foto nace como `fuerte` (se muestra con aviso) y como no publicable hasta que haya permiso.

### Esfuerzo
`recorrido` guarda cada salida: fecha, tramo, kilómetros, medio, y si se iba buscando o de paso. Un registro hallado en un recorrido apunta a él. Los recorridos sin hallazgos son tan importantes como los otros. Ver `METODO_HOTSPOTS.md`.

### Mismo animal dos veces
`cruce` guarda las parejas sospechosas (misma especie, cerca, fechas próximas) y la decisión de una persona. Sirve para la carcasa que dura días y para el cruce entre fuentes. La base propone; una persona decide.

## 4. Códigos públicos

- Los registros de Nordeste Salvaje conservan su código: `CONCESIÓN-UF#-###`, `VR-###`, `VIV-…`.
- **Propuesta para los reportes ciudadanos:** `FEV-` más un consecutivo de seis cifras (`FEV-000123`), asignado al recibir el reporte. No lleva vía ni tramo, porque a nivel nacional no siempre los hay. **Lo decide Rubén.**
- Los registros de otras fuentes no reciben código propio: se citan por su fuente y su identificador de origen.

## 5. De la hoja al modelo

### Pestaña Registros
| Columna de la hoja | Va a |
|---|---|
| ID | `registro.codigo` |
| ID anterior | `registro.codigo_anterior` |
| Fecha, Hora | `registro.fecha`, `registro.hora` |
| Latitud, Longitud | `registro.geom` |
| Especie, Nombre común, Grupo | `taxon` (y `registro.taxon_id`) |
| Validado | `registro.estado` ("Sí" → `validado`; "No" → `en_revision`) |
| Reportante | `persona` (privado) |
| Foto (URL), Fotos adicionales (Drive) | `foto.url_externa`, con `orden` |
| Notas | `registro.nota_interna`. Lo que se quiera mostrar se pasa a mano a `nota_publica` |
| Nombre original en el mapa | `identificacion` con origen `fuente` |
| Estructura más cercana, Distancia a estructura (m) | Se recalculan; los valores de la hoja sirven para comprobar |
| Unidad funcional, Concesión, Tramo de la concesión | `tramo`, `via` |
| Generación del proyecto (4G, 5G…), dato nuevo | `via.generacion`, con su fuente. Es de la concesión, no de cada registro |
| Municipio, Departamento | `registro.municipio`, `registro.departamento` |
| Toda la fila | `registro.datos_origen`, tal como estaba |

### Pestaña Fauna viva
Igual que Registros, con `tipo` = `vivo`. "Dónde estaba", "Qué hacía", "Resultado" y "Paso u obra asociada" van a `registro.detalle`.

### Pestaña Pasos de fauna
A `estructura`. "Coordenadas (lat, lon)" se separa en la geometría. Los de estado "Solicitado (no existe)" llevan `existe` = falso y no cuentan como estructura más cercana.

### Pestañas Registros ARM y Cruce ARM
Cada fila de Registros ARM es un `registro` con fuente = la concesión, `id_origen` = su número y la fila original en `datos_origen`. Las columnas "(original)" y "Problemas de calidad" se conservan ahí. Cruce ARM pasa a `cruce`. **Estos registros entran con la fuente marcada como no publicable** hasta que Rubén decida si se muestran y cómo.

## 6. Correspondencia con Darwin Core

Para la tarea 016. Los términos hay que verificarlos en la referencia oficial antes de exportar.

| Darwin Core | Sale de |
|---|---|
| `occurrenceID` | `registro.codigo`, con un prefijo estable del proyecto |
| `basisOfRecord` | "HumanObservation" |
| `eventDate`, `eventTime` | `fecha`, `hora` |
| `decimalLatitude`, `decimalLongitude` | `geom_publica` |
| `geodeticDatum` | "WGS84" |
| `coordinateUncertaintyInMeters` | `precision_m`, o `difuminar_m` si la ubicación se difuminó |
| `informationWithheld`, `dataGeneralizations` | Se llenan si la ubicación se difuminó |
| `scientificName`, `taxonRank`, `vernacularName` | `taxon` |
| `vitality` | "dead" o "alive", según `tipo` |
| `occurrenceRemarks` | `nota_publica` |
| `recordedBy` | `nombre_credito`, solo con permiso |
| `identifiedBy`, `dateIdentified` | Validador y fecha de validación |
| `identificationVerificationStatus` | Estado de validación |
| `associatedMedia` | Dirección pública de las fotos publicables |
| `license`, `rightsHolder` | Según la tarea 005 |
| `datasetName`, `institutionCode` | Fauna en la Vía, Nordeste Salvaje |
| `locality`, `county`, `stateProvince`, `countryCode` | Vía y PR, municipio, departamento, "CO" |
| `samplingProtocol`, `samplingEffort` | Del recorrido, cuando lo hay |

## 7. Lo que queda por decidir o comprobar

- **Permisos por rol.** El esquema activa la seguridad por filas en todas las tablas y deja al rol anónimo solo las vistas. Las políticas para validadores y administradores se escriben con la tarea 007.
- **Las vistas públicas** se ejecutan con los permisos de quien las creó. Es lo que se quiere aquí, pero hay que comprobarlo en el proveedor que se elija y revisar su aviso de seguridad sobre vistas.
- **El código `FEV-`** para reportes ciudadanos.
- **Qué se muestra de los registros de las concesiones.**
- **`nota_publica`:** si se llena a mano o si las notas del piloto se revisan una por una.
- **Sistema de coordenadas para difuminar:** el esquema usa EPSG:3116. Sirve para el centro del país; a escala nacional conviene el origen único (EPSG:9377). Comprobarlo antes de usar la función.
- **El municipio** se llena hoy con límites de OpenStreetMap. Para escala nacional conviene la capa oficial del DANE.

## 8. Cómo se da por bueno

Criterios de la tarea 003:

1. El esquema corre sin errores en una base de prueba.
2. Se cargan los 106 registros de la hoja. Se compara el conteo y diez registros a mano, incluidos uno sin hora, uno sin fecha y uno `VR-`.
3. Se cargan todas las filas de Fauna viva y de Pasos de fauna, y el conteo coincide con la hoja.
4. Entra un reporte ciudadano inventado y un registro de concesión inventado sin forzar ningún campo.
5. Una consulta con el rol anónimo a `registro` y a `persona` falla. A `registro_publico` devuelve solo validados, sin nombres ni notas internas.
6. Se pone `difuminar_m` = 5000 en una especie y sus registros cambian de coordenada pública sin tocar nada más.
7. La estructura más cercana y la distancia recalculadas coinciden con las de la hoja en diez registros.
8. Rubén revisó nombres de campos, estados y tipos.
