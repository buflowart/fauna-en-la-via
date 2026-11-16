---
frente: portal
tamano: M
dueno: agente, revisa ruben
modelo: sonnet
depende: ninguna
---
# 004 — Categorías de amenaza: UICN y Resolución 0126 de 2024

**Objetivo.** Que cada especie de la base tenga su categoría global (UICN) y nacional (MinAmbiente), y que el mapa resalte siempre las amenazadas.

**Contexto mínimo.** Decisión 11 de `docs/DECISIONES.md`. La Resolución 0126 de 2024 de MinAmbiente establece el listado oficial de especies silvestres amenazadas de Colombia (CR, EN, VU); reemplazó las resoluciones 1218 de 2003 y 1912 de 2017. Sus anexos están publicados en SiB Colombia. Fuentes en `docs/REDES.md`.

**Archivos.** `datos/referencia/resolucion-0126-2024.pdf`, `datos/referencia/amenazadas-mads-0126-2024.csv`, `datos/referencia/especies.csv`, `datos/referencia/LEEME.md` (nuevos); `index.html`.

**Pasos.**
1. Bajar el PDF oficial de la resolución y las listas de sus anexos desde la fuente oficial (MinAmbiente, ANLA o SiB Colombia). Anotar en `LEEME.md` la dirección y la fecha de descarga.
2. Dejar las listas como CSV: nombre científico, grupo, categoría. Sin corregir nombres.
3. Armar `especies.csv` con las especies de la base: nombre científico, nombre común, grupo, categoría UICN (con fecha de consulta y enlace a la ficha) y categoría nacional.
4. Para la UICN, consultar la Lista Roja especie por especie o por su API. Revisar antes sus condiciones de uso.
5. Cruzar por nombre científico. **Los nombres que no crucen no se corrigen: se listan para Rubén** (sinónimos, cambios de género).
6. En el mapa: distintivo visible para CR, EN y VU (nacional o global) y filtro "Solo amenazadas".

**Hecho cuando.**
- Todas las especies de la base tienen las dos categorías o un "sin evaluar" explícito.
- Cinco especies revisadas a mano contra la ficha de la UICN y contra el anexo coinciden.
- La lista de nombres que no cruzaron está en el PR.
- El mapa muestra el distintivo y el filtro funciona.

**Ojo.** Casi amenazada (NT) no es amenazada: se muestra, pero con otro distintivo.
