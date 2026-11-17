# Prototipo de "Reportar" (tareas 006 y 008)

Prototipo armado por Rubén con Claude el 2026-11-16, fuera del plan, antes de revisar las tareas. Funciona y ya se probó en un celular real. Se trae aquí para que Alejandro lo revise y decida qué se queda y cómo encaja con el modelo de datos y la arquitectura de `docs/ESCALA.md`. **No reemplaza las tareas 006 y 008:** es material para ellas.

Código en `reportar/`. Se corre igual que el resto (`python -m http.server 8790`) y se abre en `http://localhost:8790/reportar/`. Con `ENDPOINT` vacío queda en modo prueba: no envía nada y muestra el reporte en la consola. Hay una copia publicada aparte, solo para pruebas, en el GitHub de Rubén; la dirección de su recepción no se sube aquí.

## Qué hace

- **Sin cuenta.** La primera vez pide nombre (y teléfono, opcional) y permiso de ubicación; quedan guardados en el celular.
- **Tomar foto** abre la cámara. La ubicación sale del GPS del teléfono en ese momento, con su precisión en metros; la hora, de los metadatos o del reloj del teléfono.
- **Subir de la galería** lee de los metadatos EXIF la fecha, la hora y, si llegan, las coordenadas.
- Cada dato guarda **de dónde salió** (`fuente_hora`, `fuente_ubicacion`): metadatos de la foto, GPS del teléfono, marcado en el mapa o escrito a mano.
- Estado del animal (muerto, herido, vivo), especie si la sabe, referencia del sitio y nota.
- La foto se reduce a 2.048 px y se vuelve a codificar como JPEG (sale sin EXIF). Hasta 4 fotos por reporte.
- **Sin señal:** manifiesto, *service worker* (la página abre sin conexión) y cola en IndexedDB con reintentos. La persona ve cuántos reportes tiene pendientes. En Android intenta enviar en segundo plano (Background Sync).
- **Mapa** (Leaflet, calles y satélite) para marcar o corregir el punto a mano, como último recurso. No carga sin señal.
- **Pantalla de prueba de metadatos:** con `?prueba` en la dirección aparece un botón que muestra qué metadatos le llegan a la página de una foto, por galería o por el explorador de archivos. No envía nada.

## Recepción (provisional)

`reportar/apps-script/recepcion.gs`: una aplicación web de Google Apps Script en la cuenta de Rubén. Guarda las fotos en una carpeta privada de Drive y agrega una fila en una hoja privada de "reportes entrantes", con estado de revisión "Pendiente". **Nada entra directo a la base:** Rubén revisa y pasa el reporte a la base con su ID. Tiene trampa para robots, límite de 20 envíos por minuto (global, no por dispositivo), descarte de reportes repetidos por su ID, protección contra fórmulas en la hoja y aviso por correo.

Es una solución de etapa cero, para empezar a recibir reportes ya y sin costo. La arquitectura de verdad la define la tarea 006.

## Hallazgo: Android borra la ubicación de las fotos de la galería

El paso 2 de la tarea 006 supone que de una foto tomada antes se pueden leer las coordenadas. **En Android no se puede desde una página web.**

- Prueba del 2026-11-16 en un Motorola moto g54 5G, con la pantalla de prueba: la misma foto de la cámara, con ubicación, escogida **desde la galería** y **desde el explorador de archivos**. En los dos casos llegaron la fecha, la hora y el modelo de la cámara, pero **el bloque GPS llegó vacío**.
- La causa es el sistema, no la página. Desde Android 13 el selector de fotos borra la ubicación a propósito, y Chrome no tiene el permiso `ACCESS_MEDIA_LOCATION`, así que el sistema la quita también por el explorador. Reporte en Chromium: <https://issues.chromium.org/issues/428397711> (consultado el 2026-11-16).
- **Lo que sí conserva la ubicación:** mandar la foto por **WhatsApp como documento**. Rubén lo comprobó el 2026-11-16.
- No se ha probado en iPhone.

## Decisiones de Rubén (2026-11-16)

Registradas en `docs/DECISIONES.md` (25 y 26):

1. **Ruta para la ubicación:** la foto se toma desde la página (GPS en el momento, funciona sin señal). Si llega de la galería sin coordenadas, la página ofrece mandar **el original por WhatsApp como documento**. El botón abre un chat con un mensaje listo que trae un código (los primeros 8 caracteres del ID del reporte), para unir el documento con su reporte. El número está por decidir (constante `WHATSAPP` en `reportar/app.js`; vacía, el botón no aparece).
2. **Falta un paso a paso** corto, con capturas, de cómo adjuntar una foto como documento en WhatsApp (Android e iPhone), para esa pantalla.
3. El mapa queda solo como último recurso: marcar a mano es impreciso y cansa.

## Frente a las tareas

| Tarea | Pide | Estado en el prototipo |
|---|---|---|
| 006 · 2 | Leer fecha y coordenadas del EXIF | Hecho, pero en Android solo llegan fecha y hora (ver hallazgo) |
| 006 · 3 | Reducir a 1.600 px / ~300 KB, sin EXIF | Reduce a 2.048 px, calidad 0,85, sin EXIF. Ajustar a 1.600 px |
| 006 · 4 | URL firmada y estado "recibido" | No: Apps Script con estado "Pendiente" |
| 006 · 5 | Foto, ubicación (GPS o mapa), fecha y hora, especie, comentario, **licencia** | Todo menos la aceptación de la licencia (depende de la tarea 005) |
| 006 · 6 | Límite por dispositivo y hora; rechazar fuera de Colombia | Límite global por minuto; no rechaza fuera de Colombia |
| 006 · 7 | Mensajes de éxito y error; no perder el reporte | Hecho |
| 008 · 1–3 | PWA, cola, reintentos, pendientes a la vista | Hecho. En el celular falta la prueba con modo avión |
| 008 · 4 | GPS sin datos, con precisión | Hecho |
| 008 · 5 | Sin mapa sin señal: coordenada en texto | Hecho |

## Verificado, no verificado y pendiente

**Verificado**
- En el computador (Chrome, ancho de celular), con fotos de prueba: lectura del EXIF (fecha, hora y coordenadas), validaciones, cola y envío, y el mapa.
- Un reporte de prueba llegó a la recepción de Apps Script (respuesta `ok`).
- En un celular real: la página publicada abre y la pantalla de prueba funciona (resultado arriba).

**No verificado**
- Reporte completo desde la cámara de un celular real, cronometrado.
- Modo avión: tres reportes que llegan al volver la señal, sin duplicados (criterio de la 008).
- El mapa con el dedo en un celular. En la emulación de escritorio el toque no marcó, con el ratón sí.
- iPhone.
- El *service worker* no se pudo registrar en el navegador de pruebas del computador; en el celular sí carga la página, pero no se ha confirmado que abra sin señal.

**Pendiente**
- Integrarlo con `index.html` (hoy es una página aparte) o al revés.
- Número de WhatsApp y el paso a paso de "como documento".
- Código del reporte: el prototipo usa un UUID; el modelo de datos propone `FEV-` asignado al recibir (lo decide Rubén).
- Licencia y consentimiento (tarea 005), límite por dispositivo y rechazo fuera de Colombia.
- Ícono PNG para iPhone.
