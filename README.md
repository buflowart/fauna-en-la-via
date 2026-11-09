# Fauna en la Vía

Prototipo de un mapa de fauna atropellada en Colombia. Lee en vivo una hoja de Google con los registros (coordenadas, especie, foto en Drive) y los muestra sobre OpenStreetMap, con vista satelital.

Es una sola página (`index.html`), sin servidor. Para verla en local:

```bash
python -m http.server 8790
```

## Capas

- `capas/ocelote-*.png`: mapa de conectividad del ocelote tomado de una diapositiva y ubicado con los registros de la hoja y la carretera (ilustrativo).
- `capas/bosque-corredor.*`: bosque en pie y bosque perdido 2001-2024 en una franja de 10 km a cada lado de la Autopista al Río Magdalena 2. Se genera con:

```bash
python -m venv analisis/.venv
analisis/.venv/Scripts/python -m pip install rasterio scipy pillow
analisis/.venv/Scripts/python analisis/bosque_corredor.py
```

Fuente del bosque: Hansen et al., Global Forest Change 2000-2024 (v1.12), Universidad de Maryland.

Estado: demostración temporal. Reportar y Validar todavía no escriben en la hoja.
