# Tareas

Una tarea por archivo, escrita para que la tome alguien sin contexto. Antes de empezar una: leer `CLAUDE.md` y `PLAN.md`.

Cada archivo abre con sus datos: `frente`, `tamano` (S: horas; M: días; L: semanas, a 10 horas por semana), `dueno`, `modelo` recomendado y `depende`.

Para subirlas como issues de GitHub: `bash docs/tareas/crear_issues.sh` (una sola vez, con `gh` autenticado). Desde ese momento mandan los issues y estos archivos quedan como referencia.

## Orden

| # | Tarea | Frente | Tamaño | Dueño | Depende de |
|---|---|---|---|---|---|
| 001 | [La página lee una copia pública filtrada](001-hoja-publica-filtrada.md) | Portal | M | Alejandro | — |
| 002 | [Organización en GitHub](002-organizacion-github.md) | Organización | S | Rubén y Alejandro | — |
| 014 | [Acuerdo de cocreadores](014-acuerdo-de-cocreadores.md) | Organización | S | Rubén y Alejandro | — |
| 005 | [Licencias y consentimiento](005-licencias-y-consentimiento.md) | Portal | M | Rubén | — |
| 004 | [Categorías de amenaza](004-categorias-de-amenaza.md) | Portal | M | Agente | — |
| 010 | [Registro de esfuerzo](010-registro-de-esfuerzo.md) | Ciencia | S | Rubén | — |
| 003 | [Modelo de datos](003-modelo-de-datos.md) | Portal | L | Alejandro | 005 |
| 015 | [Aliados y convocatorias](015-aliados-y-convocatorias.md) | Organización | M | Rubén | — |
| 017 | [Capas del mapa](017-capas-del-mapa.md) | Portal | M | Alejandro | 001 |
| 013 | [Informe técnico](013-informe-tecnico.md) | Ciencia | M | Rubén | 001 |
| 006 | [Reportar que guarda](006-reportar-que-guarda.md) | Portal | L | Alejandro | 003, 005 |
| 007 | [Identificación con IA y validación](007-identificacion-ia-y-validacion.md) | Portal | L | Alejandro | 003, 004, 006 |
| 008 | [Sin señal (PWA)](008-sin-senal-pwa.md) | Portal | M | Alejandro | 006 |
| 009 | [Fuentes externas y PR](009-fuentes-externas-y-pr.md) | Portal | M | Alejandro | 003 |
| 011 | [Protocolo en un tramo](011-protocolo-en-un-tramo.md) | Ciencia | M | Rubén | 010 |
| 016 | [Darwin Core e iNaturalist](016-darwin-core-e-inaturalist.md) | Portal | M | Alejandro | 003, 005 |
| 012 | [Hotspots](012-hotspots.md) | Ciencia | L | Alejandro | 009, 010 |

## Las tres primeras

1. **001** — cerrar la hoja maestra. Es lo único que hoy está haciendo daño.
2. **002** y **014** — acceso de Rubén al repositorio, organización propia y acuerdo de cocreadores. Son conversaciones, no código.
3. **005** y **010** — decidir licencias y empezar a anotar los recorridos. No dependen de nada y destraban el modelo de datos y la ciencia.
