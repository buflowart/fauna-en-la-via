import csv, json, sys, urllib.request, urllib.parse, datetime
reg = list(csv.DictReader(open(sys.argv[1], encoding='utf-8')))
R = list(csv.DictReader(open('datos/referencia/amenazadas-mads-0126-2024.csv', encoding='utf-8-sig')))
res = {r['Nombre científico'].strip().lower(): r['Categoría de amenaza'] for r in R}
hoy = datetime.date.today().isoformat()
def get(u):
    try:
        with urllib.request.urlopen(u, timeout=20) as f: return json.load(f)
    except Exception: return None
por = {}
for x in reg:
    e = x['Especie'].strip()
    d = por.setdefault(e, {'comunes': [], 'grupo': x['Grupo']})
    c = x['Nombre común'].strip()
    if c and c not in d['comunes']: d['comunes'].append(c)
# GBIF no resuelve estos dos nombres: se propone el nombre vigente y Rubén lo confirma.
PROPUESTOS = {'Oedipomidas leucopus': 'Saguinus leucopus', 'Daptrius chimachima': 'Milvago chimachima'}
UICN = {'LC':'LC','NT':'NT','VU':'VU','EN':'EN','CR':'CR','DD':'DD','NE':'NE','EW':'EW','EX':'EX'}
filas = []
for e in sorted(por):
    d = por[e]
    pal = e.split()
    es_sp = len(pal) == 2 and pal[1] not in ('sp.', 'cf.') and 'sin identificar' not in e
    f = dict(nombre_cientifico=e, nombre_comun=' | '.join(d['comunes']), grupo=d['grupo'],
             nombre_aceptado_gbif='', categoria_uicn='', uicn_consulta='', categoria_nacional='',
             nombre_en_resolucion='', cruce='', nota='')
    if not es_sp:
        f.update(categoria_uicn='no aplica', categoria_nacional='no aplica', cruce='sin especie', nota='Identificación por encima de especie o por confirmar')
        filas.append(f); continue
    prop = PROPUESTOS.get(e)
    m = get('https://api.gbif.org/v1/species/match?strict=true&name=' + urllib.parse.quote(prop or e))
    acept = prop or e
    if prop: f['nota'] = 'Nombre vigente PROPUESTO (GBIF no resuelve el de la base): confirmar'
    if m and m.get('usageKey'):
        key = m['usageKey']
        if m.get('status') == 'SYNONYM' and not prop:
            det = get(f'https://api.gbif.org/v1/species/{key}')
            if det and det.get('accepted'): acept = det['accepted'].split(' (')[0]; acept = ' '.join(acept.split()[:2])
            key = (det or {}).get('acceptedKey', key)
        f['nombre_aceptado_gbif'] = acept
        iu = get(f'https://api.gbif.org/v1/species/{key}/iucnRedListCategory')
        if iu and iu.get('code'):
            f['categoria_uicn'] = UICN.get(iu['code'], iu['code']); f['uicn_consulta'] = hoy
        else:
            f['categoria_uicn'] = 'sin dato'; 
    else:
        f['categoria_uicn'] = 'sin dato'; f['nota'] = 'GBIF no encontró el nombre'
    # nacional
    if e.lower() in res:
        f.update(categoria_nacional=res[e.lower()], nombre_en_resolucion=e, cruce='exacto')
    elif acept.lower() in res:
        f.update(categoria_nacional=res[acept.lower()], nombre_en_resolucion=acept, cruce='sinónimo - confirmar',
                 nota=(f['nota'] + '. ' if f['nota'] else '') + 'Nombre de la base distinto al de la resolución')
    else:
        f.update(categoria_nacional='no listada', cruce='sin cruce')
    if e in ('Canis familiaris','Felis catus'): f['nota'] = 'Doméstico'; f['categoria_nacional'] = 'no aplica'; f['cruce'] = 'doméstico'
    filas.append(f)
cols = list(filas[0].keys())
with open('datos/referencia/especies.csv', 'w', newline='', encoding='utf-8') as o:
    w = csv.DictWriter(o, cols); w.writeheader(); w.writerows(filas)
for f in filas: print(f['nombre_cientifico'], '|', f['categoria_uicn'], '|', f['categoria_nacional'], '|', f['cruce'], '|', f['nombre_aceptado_gbif'])
