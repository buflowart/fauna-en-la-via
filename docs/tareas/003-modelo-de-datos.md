---
frente: portal
tamano: L
dueno: alejandro
modelo: opus
depende: 005 para cerrar; se puede empezar antes
---
# 003 — Modelo de datos único

**Objetivo.** Un esquema PostgreSQL/PostGIS que sirva para los registros de Nordeste Salvaje, los reportes ciudadanos y los datos de concesiones y otras redes, sin rehacerlo al pasar del piloto al país.

**Contexto mínimo.** Hoy los datos viven en una hoja de Google con columnas pensadas para el piloto (unidad funcional, estructura más cercana). Decisiones que el modelo debe respetar: `docs/DECISIONES.md`, de la 7 a la 13. Arquitectura propuesta: `docs/ESCALA.md`.

**Archivos.** `docs/MODELO_DATOS.md` (nuevo), `db/esquema.sql` (nuevo), `docs/DECISIONES.md`.

**Lo que el modelo tiene que resolver.**
1. **Registro:** identificador estable, punto (WGS84), fecha, hora, estado del animal (muerto, lesionado, vivo), foto o fotos, notas públicas y notas internas separadas.
2. **Dos coordenadas:** la real y la publicada. Hoy son iguales; el día que una especie se difumine, cambia solo la publicada.
3. **Fuente** del registro: Nordeste Salvaje, reporte ciudadano, concesión (cuál), otra red (cuál), con el identificador que tenía en su origen. No confundir "ARM" la concesionaria con los ID `ARM-UF#-###`.
4. **Identificación:** especie propuesta por quien reporta, especie propuesta por la IA con nivel de confianza, especie validada, quién validó y cuándo. Historial, no sobrescritura.
5. **Estado:** recibido, en revisión, dudoso, validado, rechazado (con motivo), duplicado de otro registro.
6. **Taxón** en tabla aparte: nombre científico, nombre común, grupo, categoría UICN, categoría nacional (Res. 0126 de 2024), fecha de consulta. Ver tarea 004.
7. **Quien reporta:** tabla separada, nunca en vistas públicas. Permiso de crédito y nombre para el crédito.
8. **Vía y referencia lineal:** vía, concesión, unidad funcional, PR. Nulos fuera de vías concesionadas.
9. **Esfuerzo:** recorridos (tarea 010) enlazables a los registros hallados en ellos.
10. **Estructuras:** pasos de fauna y obras, con tipo, estado y fuente; distancia calculada, no escrita a mano.
11. **Vista pública:** una sola vista con las columnas publicables. La página y las exportaciones leen solo de ahí.
12. Correspondencia con **Darwin Core** campo por campo (tarea 016).

**Hecho cuando.**
- Los 106 registros de la hoja se cargan en el esquema sin perder ninguna columna (se compara el conteo y diez registros a mano).
- Un registro inventado de cada fuente (ciudadano, concesión) entra sin forzar campos.
- La vista pública no devuelve ningún dato de quien reporta ni notas internas.
- Cambiar la coordenada publicada de una especie no exige migración.
- Rubén revisó los nombres de los campos y los estados.
