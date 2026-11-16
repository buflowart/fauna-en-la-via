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
1. Rubén define la **lista blanca** de columnas públicas. Propuesta: `ID`, `Fecha`, `Hora`, `Latitud`, `Longitud`, `Especie`, `Nombre común`, `Grupo`, `Validado`, `Foto (URL)`, `Estructura más cercana`, `Distancia a estructura (m)`, `Unidad funcional`, `Concesión`, `Municipio`, `Departamento`. Fuera: `Reportante`, `Notas`, `Nombre original en el mapa`, `Fotos adicionales (Drive)`, `ID anterior`.
2. Crear la hoja pública, que copia solo esas columnas de la maestra. Una copia programada con Apps Script es más segura que `IMPORTRANGE`, porque no deja un enlace vivo a la maestra.
3. Cambiar `SHEET` en `index.html` por el ID de la hoja pública.
4. Rubén quita el acceso por enlace a la hoja maestra. **Solo él cambia permisos.**
5. Revisar que las fotos se sigan viendo (dependen de que cada archivo de Drive esté compartido).

**Hecho cuando.**
- `curl` sin credenciales a la hoja maestra ya no devuelve datos.
- `curl` a la hoja pública devuelve solo las columnas de la lista blanca.
- La página publicada muestra el mismo número de registros que la hoja maestra tiene con `Validado` = "Sí".
- En la pestaña de red del navegador no aparece el ID de la hoja maestra.

**Ojo.** El ID de la hoja maestra queda en el historial de git. No es un secreto si la hoja ya no es pública, pero no se vuelve a abrir por enlace.
