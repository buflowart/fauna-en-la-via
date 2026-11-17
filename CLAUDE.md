# Fauna en la Vía — instrucciones para agentes

Léelo completo antes de tocar nada. Después lee `PLAN.md` y la tarea que vas a tomar en `docs/tareas/`.

## Qué es

Plataforma web de ciencia ciudadana para registrar fauna atropellada en las vías de Colombia. Proyecto de **Nordeste Salvaje** (Yalí, Antioquia). Rubén es el dueño y decide; Alejandro es cocreador y lleva la parte técnica. El piloto es la Autopista al Río Magdalena 2 (UF1–UF2). El objetivo es identificar los tramos donde más fauna muere para priorizar pasos de fauna y otras adecuaciones.

**Este repositorio es público.** Todo lo que se escribe aquí lo puede leer cualquiera.

## Estructura

| Ruta | Qué hay |
|---|---|
| `index.html` | El prototipo: una sola página con Leaflet. Mapa, Reportar y Validar (estos dos todavía no guardan) |
| `reportar/` | Prototipo de Reportar con cola sin señal y recepción provisional en Apps Script. Ver `docs/PROTOTIPO_REPORTAR.md` |
| `capas/` | Imágenes y datos de las capas del mapa (bosque IDEAM y Hansen, conectividad ilustrativa) |
| `analisis/` | Scripts de Python que generan las capas de bosque |
| `PLAN.md` | Plan maestro: visión, criterios de éxito, frentes, hitos, riesgos |
| `docs/tareas/` | Una tarea por archivo. De ahí se toma el trabajo |
| `docs/METODO.md` | Cómo priorizar, verificar y revisar. Listas de revisión |
| `docs/DECISIONES.md` | Registro de decisiones |
| `docs/REDES.md` | Relación con Recosfa, iNaturalist, SiB y las fuentes oficiales |
| `docs/ESCALA.md` | Arquitectura por etapas y costos |
| `docs/MODELO_DATOS.md`, `db/esquema.sql` | Propuesta de modelo de datos (sin ejecutar) |
| `docs/METODO_HOTSPOTS.md` | Cómo identificar hotspots con datos oportunistas |
| `datos/referencia/` | Lista de especies amenazadas de la Res. 0126 de 2024 |
| `docs/CONTEXTO.md` | Historia de las primeras sesiones. Tiene partes desactualizadas, marcadas arriba |
| `reports/`, `research_notes/` | Investigación de financiación del 12 nov 2026. Léela con las correcciones de `CONTEXTO.md` |

## Cómo correrlo

```bash
python -m http.server 8790
```

Y abrir `http://localhost:8790`. No hay paso de compilación.

## Hechos que no se negocian

1. Los registros son **registros reportados**, no el total de animales muertos. Casi todos son hallazgos oportunistas y hay sesgo de muestreo.
2. No se afirman tasas por kilómetro, totales ni "el peor tramo" sin esfuerzo de muestreo.
3. Que la obra de la vía y la deforestación coincidan en el tiempo **no prueba causa**. Ninguna fuente de bosque da certeza.
4. La IA propone la especie; **una persona valida**. Nada se publica como validado sin esa revisión.
5. Las especies amenazadas (UICN y Resolución 0126 de 2024 de MinAmbiente) siempre se resaltan y siempre las revisa una persona.
6. Una carcasa puede durar más de una semana en la vía: dos fotos de la misma especie en el mismo punto pueden ser el mismo animal. Se pregunta antes de contar dos.
7. "ARM" es la concesionaria Autopista Río Magdalena. Los ID `ARM-UF#-###` son de registros de Nordeste Salvaje **en** esa concesión, no registros de la concesionaria. La fuente de un registro va en su propio campo.

## Qué nunca hacer

- Publicar datos personales de quien reporta: nombre, teléfono, correo, ubicación de su casa. Tampoco escribirlos en ningún archivo del repositorio.
- Subir claves, tokens o contraseñas. Van en `.env` (ignorado por git) o en los secretos del proveedor.
- Leer o exponer la hoja maestra de registros desde código público. La página lee solo la copia pública filtrada por **lista blanca** de columnas.
- Escribir en este repositorio estrategia legal, borradores de peticiones o información que Rubén marque como reservada.
- Hacer `push`, publicar, cambiar permisos de archivos o aceptar condiciones de un servicio sin el visto bueno expreso de Rubén o de Alejandro.
- Borrar datos o archivos. Si algo sobra, se mueve a una carpeta `_por_borrar/` y se avisa.
- Corregir taxonomía o nombres científicos por cuenta propia: se propone y Rubén aprueba.
- Citar una norma, un precio o una cifra de memoria. Se abre la fuente y se pone el enlace con la fecha.

## Convenciones

- **Idioma:** español, directo, sin relleno. Código y nombres de archivo sin tildes ni espacios.
- **Ramas:** una por tarea, `NNN-nombre-corto` (el número de la tarea o del issue).
- **Commits:** en español, en presente, diciendo qué cambia. Cortos.
- **Pull request:** todo entra a `main` por PR, con una aprobación de alguien distinto de quien lo hizo. La descripción dice qué tarea cierra y cómo se verificó.
- **Coordenadas:** latitud y longitud en grados decimales, WGS84, con punto decimal. Así: `6.59, -74.78637`.
- **Fechas:** `AAAA-MM-DD`. Horas en 24 horas, hora de Colombia.
- **Datos pesados** (rasters, fotos originales): fuera de git. En el repositorio va el script que los baja o los genera.

## Antes de pedir revisión

1. Corre la página y haz la acción que cambiaste, en ancho de celular.
2. Revisa la consola del navegador: sin errores.
3. Mira qué datos salen por la red: nada fuera de la lista blanca.
4. Aplica la lista de revisión que corresponda de `docs/METODO.md`.
5. En el PR, separa: **verificado (y cómo)**, **no verificado** y **lo que queda pendiente**.

Quien construye no se aprueba a sí mismo.

## Cuándo parar y preguntar

Si la tarea toca datos personales, permisos, plata, cuentas nuevas, algo que no se puede deshacer, o si contradice el plan o los datos. La lista completa está en la sección 6 de `docs/METODO.md`.
