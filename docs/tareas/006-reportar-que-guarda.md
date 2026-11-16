---
frente: portal
tamano: L
dueno: alejandro
modelo: sonnet
depende: 003, 005
---
# 006 — Reportar guarda de verdad

**Objetivo.** Que un reporte hecho desde el celular quede guardado con su foto, en menos de un minuto y sin crear cuenta.

**Contexto mínimo.** Hoy el formulario de `index.html` agrega el reporte a una lista en memoria y lo pierde al recargar. Arquitectura propuesta en `docs/ESCALA.md`, etapa 1.

**Archivos.** `index.html` (o su división en archivos), funciones del servidor, `db/`.

**Pasos.**
1. Crear los proyectos en los proveedores elegidos (lo hace una persona, no un agente) y dejar las claves en secretos.
2. Antes de tocar la foto, leer de sus metadatos EXIF la fecha y las coordenadas y ofrecerlas como valores iniciales si la persona no usa el GPS. Sirve para fotos tomadas antes.
3. En el celular: reducir la foto (lado largo de 1.600 px, unos 300 KB) y volver a codificarla, para que salga **sin metadatos EXIF**.
4. Subir la foto al almacenamiento con una URL firmada de corta duración; guardar el registro con estado "recibido".
5. Campos: foto, ubicación (GPS o toque en el mapa), fecha y hora, especie si la sabe, comentario, aceptación de la licencia. Quitar "Tramo (unidad funcional)": a nivel nacional no aplica, y se calcula.
6. Límite de envíos por dispositivo y por hora. Rechazar ubicaciones fuera de Colombia.
7. Mensaje claro de éxito y de error. Si falla el envío, el reporte no se pierde (se enlaza con la tarea 008).

**Hecho cuando.**
- Un reporte hecho desde un celular real aparece en la base con su foto, y la foto guardada no tiene EXIF (se comprueba con una herramienta de metadatos).
- Cronometrado, el reporte toma menos de un minuto con señal normal.
- El reporte no aparece en el mapa público hasta que se valide.
- Veinte envíos seguidos desde el mismo dispositivo activan el límite.
- La vista pública no devuelve datos de quien reportó.
