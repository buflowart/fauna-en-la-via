# Método: cómo priorizar, verificar y revisar

16 nov 2026. Lo escribió Fable 5.2 para que personas y modelos más chicos trabajen con el mismo criterio cuando Fable no esté. No es un reglamento: es la forma de decidir. Si una regla de aquí choca con el sentido común en un caso concreto, se para y se pregunta.

## 1. Cómo se prioriza

Antes de empezar cualquier cosa, tres preguntas en este orden:

1. **¿Algo está haciendo daño ahora?** Datos personales expuestos, una afirmación falsa publicada, una clave en el repositorio. Eso va primero, aunque sea aburrido y aunque haya otra cosa más interesante.
2. **¿Qué está bloqueando a lo demás?** Mirar la ruta crítica de `PLAN.md`. Una tarea que destraba tres vale más que una tarea vistosa que no destraba ninguna.
3. **¿Qué es caro de cambiar después?** El modelo de datos, las licencias, lo que se le promete a quien reporta y lo que se le dice a un aliado. Eso se piensa despacio. Lo que es barato de cambiar (colores, textos, el orden de un menú) se hace rápido y se corrige sobre la marcha.

Se deja para después, por escrito y con el motivo: lo estético, lo que solo sirve con un volumen que todavía no hay, y lo que depende de una respuesta que no ha llegado.

Con 10 horas a la semana, la regla práctica es **una tarea en curso por persona**. Terminar vale más que empezar.

## 2. Qué cuenta como evidencia

La regla general: **se mira la cosa, no lo que alguien dijo de la cosa.** Un resumen, un `README`, un mensaje de commit o este mismo documento son pistas, no pruebas.

| Tema | Evidencia | No es evidencia |
|---|---|---|
| Datos | Un conteo sobre la hoja o la base, con la consulta o el script y la fecha | "La hoja tiene 102 registros", leído en un documento |
| Código | Abrir la página y hacer la acción en un celular o en el navegador; la salida de una prueba | "Lo implementé y funciona" |
| Mapas y análisis espacial | El sistema de coordenadas, la resolución y la fuente de cada capa; tres puntos de control comparados contra el satélite | Que la capa "se ve bien" encima del mapa |
| Especies | La foto, con los caracteres que sustentan la identificación y el nivel de confianza | El nombre que venía en el mensaje de quien reportó |
| Normas y textos legales | El texto oficial, con número, fecha y artículo | Una nota de prensa, un resumen de un buscador o la memoria de un modelo |
| Precios y condiciones de servicios | La página oficial del proveedor, con la fecha de consulta | Un blog de comparación |
| Lo que dijo una persona | Quién, cuándo y por dónde | "Quedamos en que…" |

Todo informe y toda entrega separan tres cosas: **verificado (y cómo)**, **inferido** y **de memoria o sin fuente**. Si algo no se pudo verificar, se dice. Nunca se rellena.

## 3. Lo que este proyecto no puede decir

Son errores que invalidan una entrega, sea código, informe o publicación:

1. **"Total de animales muertos" o cualquier tasa por kilómetro** a partir de registros oportunistas. Son registros reportados. Hay sesgo de muestreo: se encuentra más donde más se pasa.
2. **Causalidad** entre la vía y la deforestación, o entre un paso de fauna y un cambio en los registros, sin un diseño que la sustente. Que dos cosas coincidan en el tiempo no prueba que una cause la otra.
3. **"El peor tramo"** sin esfuerzo de muestreo. Se puede decir "el tramo con más registros".
4. **Una especie validada** que solo identificó la IA.
5. **Datos personales** de quien reporta.
6. **Dos registros** donde puede haber un solo animal: una carcasa puede durar más de una semana en la vía.

## 4. Listas de revisión

Cada lista va por severidad. Con un solo punto de "invalida", la entrega no pasa.

### Cambio de código
**Invalida**
- Expone datos que no están en la lista blanca de columnas públicas, o lee una fuente privada.
- Hay una clave, un token o una contraseña en el código o en el historial.
- Publica reportes sin validar, o permite validar sin haber iniciado sesión.
- Se pierde un reporte: la persona envía y no queda guardado, y nadie se entera.
- Guarda o muestra la foto con sus metadatos EXIF.

**Debilita**
- No se probó en un celular real con señal mala.
- No hay mensaje claro cuando algo falla.
- Cambia el modelo de datos sin migración ni nota en `DECISIONES.md`.
- Agrega una dependencia o un servicio nuevo sin justificarlo.

**Menor**
- Nombres, formato, textos, estilos.

### Análisis espacial o estadístico
**Invalida**
- Capas en sistemas de coordenadas distintos sin reproyectar.
- Conclusiones de tasa, total o causa (sección 3).
- No se puede reproducir: falta el script, la fuente o la fecha de los datos.
- Registros duplicados o la misma carcasa contada dos veces.

**Debilita**
- No dice el esfuerzo de muestreo ni sus limitaciones.
- Una sola fuente de cobertura de bosque presentada como certeza.
- Umbrales (distancias, anchos de banda, tamaño de celda) elegidos sin explicar.
- Sin puntos de control contra el satélite o el terreno.

**Menor**
- Leyendas, colores, redondeos.

### Documento para una autoridad
Estos documentos no se escriben en este repositorio. Si un agente ayuda a preparar uno, aplica igual:

**Invalida**
- Un hecho sin soporte (foto, registro, radicado, norma citada con artículo).
- Una norma citada de memoria.
- Una pregunta que se puede responder con "sí" o con una generalidad.
- Sale sin que lo aprueben Rubén y Alejandro.

**Debilita**
- Preguntas que mezclan dos asuntos.
- No pide documentos concretos ni fechas.
- No lleva la lista de anexos.

### Postulación a un fondo
**Invalida**
- No cumple un requisito de elegibilidad (personería, país, tema, monto).
- Promete resultados que los datos no permiten.
- Cifras que no cuadran con la base.

**Debilita**
- No dice qué pasa cuando se acaba la plata.
- Presupuesto sin justificar.
- No nombra a los aliados ni lo que aporta cada uno.

### Pieza de campaña
**Invalida**
- Una foto fuerte sin aviso, o una foto sin permiso de quien la tomó.
- Una cifra sin fuente o un "total de muertes".
- Señala a una persona o a una empresa con algo que no está probado.

**Debilita**
- No dice qué hacer ("repórtalo aquí") ni lleva el enlace.
- Lenguaje técnico para un público general.

## 5. Errores típicos de un modelo más chico en este proyecto

| Error | Cómo se detecta |
|---|---|
| Da por cierto lo que dice un `.md` (las cifras de `CONTEXTO.md`, por ejemplo) | Pedirle la consulta o el comando con que lo midió |
| Dice "listo" sin haber abierto la página | Pedir captura o salida de la prueba; revisar el artefacto |
| Inventa una fuente, un artículo de una norma o un precio | Abrir el enlace; si no abre o no dice eso, se descarta el dato |
| Convierte registros en tasas ("X animales por km") | Buscar "por km", "tasa", "total", "mortalidad" en el texto |
| Quita una columna con lista negra y deja pasar otra sensible | Exigir lista blanca; revisar la salida, no el filtro |
| Mezcla "ARM" la concesionaria con los ID `ARM-UF#-###` de los registros propios | Revisar que la fuente del registro esté en su propio campo |
| Cambia el nombre científico por uno desactualizado o "corrige" uno que estaba bien | Toda corrección de taxonomía la aprueba Rubén |
| Arregla más de lo que se le pidió | Comparar el cambio con la tarea; lo que sobra se devuelve |
| Borra en vez de archivar | Nada se borra sin preguntar |
| Hace `push` o publica sin permiso | Regla de `CLAUDE.md`: nunca |

## 6. Cuándo parar y preguntar

Un agente **para y le pregunta a una persona** cuando:

- La tarea toca datos personales, la hoja maestra o los permisos de un archivo.
- Hay que decidir qué se publica y qué no.
- Algo de la tarea contradice `PLAN.md`, `DECISIONES.md` o lo que encuentra en los datos.
- La identificación de una especie amenazada es dudosa.
- Hay que gastar plata, crear una cuenta o aceptar condiciones de un servicio.
- Lleva dos intentos fallidos en lo mismo.
- Lo que se va a hacer no se puede deshacer.

Se **escala a un modelo más fuerte** (o a una revisión humana cuidadosa) cuando hay que cambiar el modelo de datos, decidir algo con consecuencias legales o científicas, o revisar algo que sale del proyecto.

## 7. Bucle de revisión

1. **Quien construye no se aprueba a sí mismo.** Ni una persona ni un agente.
2. El revisor entra **con contexto fresco**: lee la tarea y mira el artefacto real (la página funcionando, el archivo, el mapa). No lee el resumen del constructor hasta después.
3. El revisor da el **veredicto primero**: pasa, o no pasa y qué hay que arreglar antes.
4. Después, los hallazgos numerados por severidad, cada uno con evidencia medida: archivo y línea, coordenada, valor, captura.
5. Una sección aparte de **"verificado correcto (y cómo)"**, separada de **"no pude verificar"**.
6. **Una brecha por ronda:** el revisor nombra la más grave; se arregla; se revisa otra vez. Diez observaciones a la vez no se arreglan bien.
7. Lo que se posterga queda escrito con el motivo, en la tarea o en `DECISIONES.md`.

Orden de búsqueda del revisor: primero lo que tumba todo el trabajo, después lo que lo encarece, al final la estética.

## 8. Con qué modelo

| Trabajo | Modelo |
|---|---|
| Estrategia; decisiones con consecuencias legales o científicas; modelo de datos; revisión final de lo que sale del proyecto | Opus (Fable si hay) |
| Programar una tarea bien especificada; análisis con scripts; borradores | Sonnet |
| Tareas mecánicas: formatear, renombrar, resumir, mover datos | Haiku |
| Identificación de especies en fotos | Opus propone; una persona valida |
| Terreno, contactos, firmas, decisiones del proyecto | Personas |

Regla de costo: se usa el modelo más chico que pueda con la tarea **tal como está escrita**. Si la tarea no está bien escrita, primero se escribe bien con un modelo fuerte y después se ejecuta con uno chico.

## 9. Lo que se confirmó del método observado

`PROMPT_FABLE_PLAN.md` trae cinco observaciones de revisiones de Fable en otro proyecto. Aplican aquí y están recogidas arriba: revisar el artefacto y no el resumen (sección 2), veredicto primero y hallazgos por severidad (sección 7), "verificado" separado de "de memoria" (secciones 2 y 7), lo postergado queda escrito (sección 1) y buscar primero lo que tumba todo (sección 7). Lo que se agregó para este proyecto es la sección 3, porque aquí el error más caro no es de código: es afirmar algo que los datos no sostienen.
