"""Bosque y pérdida de bosque en el corredor de la Autopista al Río Magdalena 2.

Fuentes:
  - Registros de atropellamiento: hoja de Google del proyecto (CSV público).
  - Trazado de la vía: OSRM (enrutador público sobre OpenStreetMap).
  - Bosque: Hansen et al., Global Forest Change 2000-2024 (v1.12), Universidad de Maryland.
    treecover2000 (% de dosel en 2000) y lossyear (año de pérdida, 1 = 2001 ... 24 = 2024).

Salidas (en ../capas/):
  - bosque-corredor.png  capa para el mapa (verde = bosque en pie, rojo = bosque perdido)
  - bosque-corredor.json límites de la capa, estadísticas por distancia a la vía y por año

Uso:  analisis/.venv/Scripts/python analisis/bosque_corredor.py
"""
import csv
import io
import json
import math
import os
import sys
import urllib.request

import numpy as np
import rasterio
from rasterio.features import rasterize
from rasterio.windows import from_bounds
from scipy import ndimage as ndi
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(AQUI, "datos")
CAPAS = os.path.join(AQUI, "..", "capas")
SHEET = "https://docs.google.com/spreadsheets/d/1iY2ZIkoyxwPiNVE1eQjFMKy0eZceiFhoyyFoftcnEk4/export?format=csv&gid=0"
HANSEN = "https://storage.googleapis.com/earthenginepartners-hansen/GFC-2024-v1.12/Hansen_GFC-2024-v1.12_{capa}_10N_080W.tif"
UMBRAL_DOSEL = 30          # % de dosel en 2000 para contar como bosque
CORREDOR_KM = 10           # ancho del corredor a cada lado de la vía
BANDAS_KM = [0, 0.5, 1, 2, 5, 10]
PARCHE_MIN_HA = 10         # parches más pequeños no cuentan en la fragmentación


def leer_registros():
    txt = urllib.request.urlopen(SHEET, timeout=60).read().decode("utf-8")
    filas = list(csv.DictReader(io.StringIO(txt)))
    pts = []
    for f in filas:
        try:
            pts.append((float(f["Latitud"]), float(f["Longitud"])))
        except (ValueError, KeyError):
            pass
    return pts


def trazar_via(pts):
    sur = min(pts, key=lambda p: p[0])
    norte = max(pts, key=lambda p: p[0])
    url = ("https://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=geojson"
           % (sur[1], sur[0], norte[1], norte[0]))
    j = json.load(urllib.request.urlopen(url, timeout=60))
    return [(la, lo) for lo, la in j["routes"][0]["geometry"]["coordinates"]]


def bajar(capa):
    os.makedirs(DATOS, exist_ok=True)
    ruta = os.path.join(DATOS, capa + "_10N_080W.tif")
    if not os.path.exists(ruta):
        print("Descargando", capa, "...")
        tmp = ruta + ".part"
        urllib.request.urlretrieve(HANSEN.format(capa=capa), tmp)
        os.replace(tmp, ruta)
    return ruta


def main():
    pts = leer_registros()
    via = trazar_via(pts)
    print(len(pts), "registros con coordenadas;", len(via), "vértices de vía")

    # control: qué tan cerca de la vía trazada caen los registros
    va = np.array(via)
    d_reg = []
    for la, lo in pts:
        d = np.hypot((va[:, 0] - la) * 110570, (va[:, 1] - lo) * 110570 * math.cos(math.radians(la)))
        d_reg.append(d.min())
    d_reg = np.array(d_reg)
    print("Registros a la vía: mediana %.0f m, p90 %.0f m, máx %.0f m" % (np.median(d_reg), np.percentile(d_reg, 90), d_reg.max()))

    margen = CORREDOR_KM / 110.57 + 0.01
    sur, norte = va[:, 0].min() - margen, va[:, 0].max() + margen
    lat_m = (sur + norte) / 2
    oeste = va[:, 1].min() - margen / math.cos(math.radians(lat_m))
    este = va[:, 1].max() + margen / math.cos(math.radians(lat_m))

    with rasterio.open(bajar("treecover2000")) as src:
        win = from_bounds(oeste, sur, este, norte, src.transform).round_offsets().round_lengths()
        dosel = src.read(1, window=win)
        tr = src.window_transform(win)
    with rasterio.open(bajar("lossyear")) as src:
        win2 = from_bounds(oeste, sur, este, norte, src.transform).round_offsets().round_lengths()
        anio = src.read(1, window=win2)
    h, w = dosel.shape
    print("Ventana", w, "x", h, "píxeles")

    px_x = abs(tr.a) * 111320 * math.cos(math.radians(lat_m))   # m por píxel (este-oeste)
    px_y = abs(tr.e) * 110570                                    # m por píxel (norte-sur)
    ha_px = px_x * px_y / 10000

    # distancia de cada píxel a la vía
    linea = {"type": "LineString", "coordinates": [(lo, la) for la, lo in via]}
    via_r = rasterize([(linea, 1)], out_shape=(h, w), transform=tr, all_touched=True, dtype="uint8")
    dist = ndi.distance_transform_edt(via_r == 0, sampling=(px_y, px_x)) / 1000.0   # km
    corredor = dist <= CORREDOR_KM

    bosque2000 = (dosel >= UMBRAL_DOSEL) & corredor
    perdido = bosque2000 & (anio > 0)
    en_pie = bosque2000 & ~perdido

    # estadísticas por banda de distancia
    bandas = []
    for a, b in zip(BANDAS_KM, BANDAS_KM[1:]):
        m = (dist >= a) & (dist < b)
        b0 = int((bosque2000 & m).sum())
        pe = int((perdido & m).sum())
        area = int((m & corredor).sum())
        bandas.append({"desde_km": a, "hasta_km": b,
                       "area_ha": round(area * ha_px), "bosque2000_ha": round(b0 * ha_px),
                       "perdido_ha": round(pe * ha_px), "en_pie_ha": round((b0 - pe) * ha_px),
                       "perdida_pct": round(100 * pe / b0, 1) if b0 else None,
                       "bosque_hoy_pct": round(100 * (b0 - pe) / area, 1) if area else None})

    # pérdida por año: cerca (0-1 km) vs lejos (5-10 km), en % del bosque de 2000 de cada franja
    cerca = (dist < 1) & bosque2000
    lejos = (dist >= 5) & (dist <= CORREDOR_KM) & bosque2000
    por_anio = []
    for y in range(1, 25):
        por_anio.append({"anio": 2000 + y,
                         "cerca_pct": round(100 * int(((anio == y) & cerca).sum()) / max(1, int(cerca.sum())), 3),
                         "lejos_pct": round(100 * int(((anio == y) & lejos).sum()) / max(1, int(lejos.sum())), 3),
                         "total_ha": round(int(((anio == y) & bosque2000).sum()) * ha_px)})

    # fragmentación: parches de bosque en pie, con y sin la vía como barrera
    est = np.ones((3, 3), bool)
    sin_via, n1 = ndi.label(en_pie, structure=est)
    barrera = dist * 1000 <= 30          # franja de 30 m a cada lado de la vía
    con_via, n2 = ndi.label(en_pie & ~barrera, structure=est)
    min_px = PARCHE_MIN_HA / ha_px
    tam1 = np.bincount(sin_via.ravel())
    tam2 = np.bincount(con_via.ravel())
    partidos = []
    for lab in range(1, n1 + 1):
        if tam1[lab] < min_px:
            continue
        piezas = np.unique(con_via[sin_via == lab])
        piezas = [p for p in piezas if p and tam2[p] >= min_px]
        if len(piezas) >= 2:
            partidos.append({"area_ha": round(tam1[lab] * ha_px), "pedazos": len(piezas)})
    partidos.sort(key=lambda x: -x["area_ha"])
    grandes = int((tam1[1:] >= min_px).sum())
    print("Parches >= %d ha: %d; partidos por la vía: %d" % (PARCHE_MIN_HA, grandes, len(partidos)))

    # capa PNG con paleta: 0 transparente, 1 bosque en pie, 2 bosque perdido
    img = np.zeros((h, w), np.uint8)
    img[en_pie] = 1
    img[perdido] = 2
    pil = Image.fromarray(img, "P")
    pil.putpalette([0, 0, 0, 34, 139, 70, 214, 48, 39] + [0] * (256 * 3 - 9))
    pil.info["transparency"] = bytes([0] + [255] * 255)
    os.makedirs(CAPAS, exist_ok=True)
    pil.save(os.path.join(CAPAS, "bosque-corredor.png"), optimize=True, transparency=bytes([0] + [255] * 255))

    norte_r, oeste_r = tr.f, tr.c
    sur_r, este_r = tr.f + tr.e * h, tr.c + tr.a * w
    tot_b0 = int(bosque2000.sum()); tot_pe = int(perdido.sum())
    salida = {
        "fuente": "Hansen et al., Global Forest Change 2000-2024 (v1.12), Universidad de Maryland",
        "umbral_dosel_pct": UMBRAL_DOSEL, "corredor_km": CORREDOR_KM,
        "limites": [[round(sur_r, 6), round(oeste_r, 6)], [round(norte_r, 6), round(este_r, 6)]],
        "via": [[round(la, 5), round(lo, 5)] for la, lo in via[::3]] + [[round(via[-1][0], 5), round(via[-1][1], 5)]],
        "via_km": round(float(sum(math.hypot((b[0] - a[0]) * 110.57, (b[1] - a[1]) * 110.57 * math.cos(math.radians(a[0]))) for a, b in zip(via, via[1:]))), 1),
        "registros_a_via_m": {"mediana": round(float(np.median(d_reg))), "p90": round(float(np.percentile(d_reg, 90)))},
        "total": {"bosque2000_ha": round(tot_b0 * ha_px), "perdido_ha": round(tot_pe * ha_px),
                  "en_pie_ha": round((tot_b0 - tot_pe) * ha_px), "perdida_pct": round(100 * tot_pe / tot_b0, 1)},
        "bandas": bandas, "por_anio": por_anio,
        "fragmentacion": {"parche_min_ha": PARCHE_MIN_HA, "parches": grandes, "partidos_por_via": len(partidos),
                          "area_partida_ha": sum(p["area_ha"] for p in partidos), "mayores": partidos[:5]},
    }
    with open(os.path.join(CAPAS, "bosque-corredor.json"), "w", encoding="utf-8") as f:
        json.dump(salida, f, ensure_ascii=False, indent=1)
    print(json.dumps({k: salida[k] for k in ("via_km", "total", "fragmentacion")}, ensure_ascii=False, indent=1))
    for b in bandas:
        print(b)


if __name__ == "__main__":
    sys.exit(main())
