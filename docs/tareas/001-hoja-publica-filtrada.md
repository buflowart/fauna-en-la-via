---
frente: portal
tamano: M
dueno: alejandro
modelo: sonnet
depende: ninguna
---
# 001 — La página lee una copia pública filtrada, no la hoja maestra

**Objetivo.** Que nadie pueda descargar la hoja maestra de registros, y que la página siga mostrando el mapa.

**Contexto mínimo.** `index.html` lee en vivo la hoja maestra (variable `SHEET`, lectura por `gviz`). El 16 nov 2026 se comprobó que esa hoja se descarga sin iniciar sesión, con todas sus columnas, incluidas `Reportante` (nombres de personas) y `Notas` (apuntes internos). Rubén decidió publicar una copia filtrada.

**Archivos.** `index.html`; una hoja de Google nueva ("Fauna en la Vía — datos públicos"); un script de Apps Script en esa hoja.

**Pasos.**
1. **Lista blanca de columnas, decidida por Rubén el 16 nov 2026:**
   - **El registro:** `ID`, `Especie` (con `Nombre común`), `Grupo` (da el color), `Fecha`, `Hora`, `Latitud`, `Longitud`, `Foto (URL)` y una **observación pública** cuando haya algo relevante que contar.
   - **La vía:** `Unidad funcional`, `Concesión`, `Tramo de la concesión` y la **generación del proyecto** (4G, 5G u otra; o "no concesionada").
   - Solo se copian los registros con `Validado` = "Sí", así que esa columna no hace falta en la copia.
   - **Fuera:** `Reportante`, `Notas`, `Nombre original en el mapa`, `Fotos adicionales (Drive)`, `ID anterior`, `Municipio`, `Departamento`.
   - **También van, con forma de mostrarse por definir (decisión 22):** `Estructura más cercana` y `Distancia a estructura (m)`. Rubén quiere publicarlas, pero la manera de presentarlas tiene que ser información útil para quien lee el mapa, no solo dos datos sueltos. Mientras se define, la copia pública las incluye y la ficha puede mostrarlas de forma sencilla.
   - **La observación pública no es la columna `Notas`.** Es una columna nueva en la hoja maestra, que Rubén llena a mano solo en los registros donde quiera contar algo que ayude a entender el registro (por ejemplo, si el animal iba con cría o si había un paso de fauna a pocos metros). `Notas` sigue siendo interna y nunca se publica.
   - **La generación del proyecto es un dato de la concesión, no de cada registro.** Va en una tabla corta (concesión → generación, con la fuente), y la copia pública la trae de ahí. Tomarla del contrato o de la ficha del proyecto en la ANI, no de memoria.
2. Crear la hoja pública, que copia solo esas columnas de la maestra. Una copia programada con Apps Script es más segura que `IMPORTRANGE`, porque no deja un enlace vivo a la maestra.
3. Cambiar `SHEET` en `index.html` por el ID de la hoja pública.
4. Rubén quita el acceso por enlace a la hoja maestra. **Solo él cambia permisos.**
5. Revisar que las fotos se sigan viendo (dependen de que cada archivo de Drive esté compartido).

**Hecho cuando.**
- `curl` sin credenciales a la hoja maestra ya no devuelve datos.
- `curl` a la hoja pública devuelve solo las columnas de la lista blanca, y solo registros validados.
- La página no muestra errores por las columnas que ya no llegan.
- La página publicada muestra el mismo número de registros que la hoja maestra tiene con `Validado` = "Sí".
- En la pestaña de red del navegador no aparece el ID de la hoja maestra.

**Ojo.** El ID de la hoja maestra queda en el historial de git. No es un secreto si la hoja ya no es pública, pero no se vuelve a abrir por enlace.
