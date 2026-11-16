---
frente: portal
tamano: M
dueno: alejandro
modelo: sonnet
depende: 006
---
# 008 — Funciona sin señal y se puede instalar

**Objetivo.** Que un reporte hecho en un tramo sin señal se guarde en el celular y se envíe solo cuando vuelva la conexión.

**Contexto mínimo.** En el corredor piloto hay tramos largos sin cobertura. Es donde más se pierden reportes.

**Pasos.**
1. Manifiesto y *service worker*: la página abre sin conexión y se puede agregar a la pantalla de inicio.
2. Cola local (IndexedDB) con el reporte y la foto ya reducida.
3. Envío automático al recuperar la señal, con reintentos. La persona ve cuántos reportes tiene pendientes.
4. El GPS funciona sin datos: guardar la coordenada y su precisión en metros.
5. El mapa base no carga sin señal: mostrar la coordenada en texto y permitir enviar igual.

**Hecho cuando.** En un celular en modo avión se hacen tres reportes; al quitar el modo avión llegan los tres a la base, sin duplicados, con su foto y su hora original (no la hora de envío).
