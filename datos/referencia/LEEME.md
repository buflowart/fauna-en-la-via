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

La UICN sí usa *Oedipomidas leucopus* (antes *Saguinus leucopus*; VU A4cd, evaluada en 2020, publicada en 2021), según su ficha consultada el 16 nov 2026. El nombre base del proyecto es el de la UICN, y el de la resolución va como sinónimo.

La lista usa el nombre con que se expidió la resolución. Cada especie de la plataforma debe guardar, además de su nombre vigente, **el nombre con que aparece en la resolución**. Los cruces dudosos los decide Rubén.

Falta (tarea 004): el PDF de la resolución, la tabla `especies.csv` con las dos categorías para cada especie de la base, y la categoría de la UICN.
