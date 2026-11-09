"""Compara el bosque de Hansen (UMD) con el bosque natural oficial del IDEAM en el corredor.

Necesita antes haber corrido bosque_corredor.py (usa su trazado de la vía y su ventana).
IDEAM: Sistema de Monitoreo de Bosques y Carbono (SMByC), Superficie cubierta por bosque natural 2025,
bnb_2025_v8_260729.img (1 = bosque, 2 = no bosque, 3 = sin información), EPSG:3116, 30 m.
https://bart.ideam.gov.co/smbyc/Superficie%20Cubierta%20Bosque%20Natural/Capas/

Salidas (en ../capas/):
  - ideam-corredor.png    bosque natural IDEAM 2025 en el corredor
  - comparacion-corredor.png  verde = bosque en las dos, amarillo = solo Hansen, azul = solo IDEAM
  - ideam-corredor.json   cifras de la comparación
"""
import json
import math
import os
import urllib.request

import numpy as np
import rasterio
from rasterio.features import rasterize
from rasterio.warp import reproject, Resampling
from rasterio.windows import from_bounds
from scipy import ndimage as ndi
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(AQUI, "datos")
CAPAS = os.path.join(AQUI, "..", "capas")
IDEAM_URL = "https://bart.ideam.gov.co/smbyc/Superficie%20Cubierta%20Bosque%20Natural/Capas/bnb_2025_v8_260729.img"
BANDAS_KM = [0, 0.5, 1, 2, 5, 10]


def png(arr, colores, nombre):
    pil = Image.fromarray(arr.astype(np.uint8), "P")
    pal = [0, 0, 0]
    for c in colores:
        pal += c
    pil.putpalette(pal + [0] * (768 - len(pal)))
    pil.save(os.path.join(CAPAS, nombre), optimize=True, transparency=bytes([0] + [255] * 255))


def main():
    base = json.load(open(os.path.join(CAPAS, "bosque-corredor.json"), encoding="utf-8"))
    (sur, oeste), (norte, este) = base["limites"]
    umbral, corr_km = base["umbral_dosel_pct"], base["corredor_km"]

    ruta_ideam = os.path.join(DATOS, "bnb_2025_v8_260729.img")
    if not os.path.exists(ruta_ideam):
        urllib.request.urlretrieve(IDEAM_URL, ruta_ideam)

    with rasterio.open(os.path.join(DATOS, "treecover2000_10N_080W.tif")) as src:
        win = from_bounds(oeste, sur, este, norte, src.transform).round_offsets().round_lengths()
        dosel = src.read(1, window=win)
        tr, crs = src.window_transform(win), src.crs
    with rasterio.open(os.path.join(DATOS, "lossyear_10N_080W.tif")) as src:
        anio = src.read(1, window=from_bounds(oeste, sur, este, norte, src.transform).round_offsets().round_lengths())
    h, w = dosel.shape
    lat_m = (sur + norte) / 2
    px_x, px_y = abs(tr.a) * 111320 * math.cos(math.radians(lat_m)), abs(tr.e) * 110570
    ha_px = px_x * px_y / 10000

    via = base["via"]
    linea = {"type": "LineString", "coordinates": [(lo, la) for la, lo in via]}
    via_r = rasterize([(linea, 1)], out_shape=(h, w), transform=tr, all_touched=True, dtype="uint8")
    dist = ndi.distance_transform_edt(via_r == 0, sampling=(px_y, px_x)) / 1000.0
    corredor = dist <= corr_km

    ideam = np.zeros((h, w), np.uint8)
    with rasterio.open(ruta_ideam) as src:
        reproject(rasterio.band(src, 1), ideam, src_transform=src.transform, src_crs=src.crs,
                  dst_transform=tr, dst_crs=crs, resampling=Resampling.nearest)

    hansen = (dosel >= umbral) & (anio == 0) & corredor        # en pie en 2024
    id_bosque = (ideam == 1) & corredor
    sin_info = (ideam == 3) & corredor

    ambos = hansen & id_bosque
    solo_h = hansen & ~id_bosque & ~sin_info
    solo_i = id_bosque & ~hansen
    ha = lambda m: round(int(m.sum()) * ha_px)

    bandas = []
    for a, b in zip(BANDAS_KM, BANDAS_KM[1:]):
        m = (dist >= a) & (dist < b) & corredor
        area = int(m.sum())
        bandas.append({"desde_km": a, "hasta_km": b,
                       "ideam_pct": round(100 * int((id_bosque & m).sum()) / area, 1),
                       "hansen_pct": round(100 * int((hansen & m).sum()) / area, 1)})

    out = {
        "fuente": "IDEAM, SMByC: Superficie cubierta por bosque natural 2025 (bnb_2025_v8_260729)",
        "corredor_ha": ha(corredor),
        "ideam_bosque_ha": ha(id_bosque), "hansen_bosque_ha": ha(hansen),
        "ambos_ha": ha(ambos), "solo_hansen_ha": ha(solo_h), "solo_ideam_ha": ha(solo_i), "sin_info_ha": ha(sin_info),
        "coincidencia_pct": round(100 * int(ambos.sum()) / max(1, int((hansen | id_bosque).sum())), 1),
        "bandas": bandas,
    }
    with open(os.path.join(CAPAS, "ideam-corredor.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)

    png(np.where(id_bosque, 1, 0), [[34, 139, 70]], "ideam-corredor.png")
    comp = np.zeros((h, w), np.uint8)
    comp[ambos], comp[solo_h], comp[solo_i] = 1, 2, 3
    png(comp, [[34, 139, 70], [240, 190, 30], [50, 110, 200]], "comparacion-corredor.png")
    print(json.dumps(out, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
