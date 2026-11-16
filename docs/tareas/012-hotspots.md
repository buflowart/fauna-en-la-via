---
frente: ciencia
tamano: L
dueno: alejandro, revisa ruben
modelo: opus
depende: 009, 010
---
# 012 — Análisis de hotspots con método publicable

> **Avance (16 nov 2026):** el diseño del método está en `docs/METODO_HOTSPOTS.md`. Esta tarea lo ejecuta. Antes hay que tener el eje de la vía y los PR, y las respuestas de Rubén a las preguntas de la sección 12.

**Objetivo.** Identificar los tramos con concentración de registros mayor a la esperada por azar, de forma reproducible y diciendo con claridad qué se puede concluir.

**Contexto mínimo.** Es el objetivo de fondo del proyecto. Los datos son oportunistas: un análisis ingenuo marca como hotspot el tramo por donde más se pasa. Métodos usados en la literatura: **KDE+** (densidad de núcleo sobre la red vial, con prueba de significancia y orden de los agrupamientos; kdeplus.cz) y **Siriema** (K de Ripley para la escala de agregación y análisis de hotspots sobre la línea). Leer la documentación y al menos un artículo de cada uno antes de elegir.

**Pasos.**
1. Convertir los registros a posición sobre la vía (distancia a lo largo del eje, o PR).
2. Descartar duplicados y la misma carcasa contada dos veces.
3. Correr el método elegido por vía, y por grupo taxonómico donde haya suficientes registros. Decir cuántos son suficientes y por qué.
4. Repetir el análisis solo con los registros que salieron de recorridos con esfuerzo anotado, y comparar.
5. Cruzar los hotspots con la ubicación de los pasos de fauna y con la cobertura de bosque.
6. Escribir las limitaciones al principio del resultado, no al final.

**Hecho cuando.** El análisis se reproduce con un comando desde los datos públicos; un revisor con contexto fresco aplica la lista "Análisis espacial o estadístico" de `docs/METODO.md` y pasa; el texto no usa "tasa", "total" ni "el peor tramo" sin esfuerzo que lo respalde.
