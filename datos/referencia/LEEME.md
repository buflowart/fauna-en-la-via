# Datos de referencia

## `amenazadas-mads-0126-2024.csv`

Lista oficial de especies silvestres amenazadas de Colombia, según la Resolución 0126 de 2024 del Ministerio de Ambiente y Desarrollo Sostenible. 2.104 taxones: 466 en peligro crítico (CR), 800 en peligro (EN) y 838 vulnerables (VU).

- **Fuente:** Ministerio de Ambiente y Desarrollo Sostenible (2024). *Lista de especies silvestres amenazadas de la diversidad biológica continental y marino-costera de Colombia - Resolución 0126 de 2024*. Publicada por el SiB Colombia. https://doi.org/10.15472/frowz3
- **Licencia:** CC0 1.0, según la página del recurso en el IPT del SiB Colombia (consultada el 16 nov 2026). La misma página muestra además un ícono de otra licencia: confirmarlo antes de redistribuir fuera de este repositorio.
- **Cómo se obtuvo:** del archivo Excel de la lista (elaborado por el Equipo Coordinador del SiB Colombia, 11 mar 2024), aportado por Rubén el 16 nov 2026. Se conservaron 12 de sus 20 columnas, sin corregir ningún nombre.
- **Columnas:** identificador del taxón (GBIF), nombre científico, reino, filo, clase, orden, familia, rango taxonómico, nombre común, estado taxonómico, comentarios del taxón y categoría de amenaza.

### Ojo con los nombres

El cruce con la base **no se puede hacer solo por nombre científico exacto**. El 16 nov 2026, cruzando las 58 especies de la base del piloto, ninguna coincidió por nombre exacto, y sin embargo hay al menos una amenazada:

| En la base | En la resolución | Categoría |
|---|---|---|
| *Oedipomidas leucopus* (tití gris) | *Saguinus leucopus* | VU |

La lista usa el nombre con que se expidió la resolución. Cada especie de la plataforma debe guardar, además de su nombre vigente, **el nombre con que aparece en la resolución**. Los cruces dudosos los decide Rubén.

Falta (tarea 004): el PDF de la resolución, la tabla `especies.csv` con las dos categorías para cada especie de la base, y la categoría de la UICN.

## `especies.csv`

Una fila por nombre científico de la base (61 filas, 2026-11-25), con la categoría UICN, la categoría nacional (Res. 0126 de 2024) y cómo se cruzó. Lo genera `analisis/especies_categorias.py`.

- **UICN:** se tomó de GBIF (`/species/{clave}/iucnRedListCategory`), que replica la Lista Roja. **No se consultó la UICN directamente**: su API pide token y condiciones de uso. Consulta: 2026-11-25. Falta revisar a mano 5 especies contra la ficha de la UICN.
- **Cruce nacional:** por nombre exacto; si no, por el nombre aceptado que da GBIF. Dos nombres de la base GBIF no los resuelve (*Oedipomidas leucopus*, *Daptrius chimachima*): se propone el nombre vigente (*Saguinus leucopus*, *Milvago chimachima*) y queda marcado **"confirmar"**. Ningún nombre de la base se corrigió.
- **Amenazadas en la base hoy:** *Aotus griseimembra* (VU nacional y UICN) y *Oedipomidas leucopus* = *Saguinus leucopus* (VU nacional y UICN). El ocelote y el puma son LC (UICN) y no están en la resolución.
- **Valores especiales:** `no aplica` (identificación por encima de especie, o doméstico), `sin dato` (GBIF sin categoría UICN), `no listada` (no aparece en la resolución).
- **Si la base cambia:** volver a correr el script con el CSV de registros y revisar los cruces nuevos.

