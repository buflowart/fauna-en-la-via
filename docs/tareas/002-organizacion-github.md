---
frente: organizacion
tamano: S
dueno: ruben, alejandro
modelo: humanos
depende: ninguna
---
# 002 — Organización propia en GitHub y traslado del repositorio

**Objetivo.** Que el proyecto no dependa de la cuenta personal de nadie y que Rubén y Alejandro tengan acceso completo.

**Contexto mínimo.** El repositorio vive en `buflowart/fauna-en-la-via`, cuenta de la marca de Alejandro. Los pasos están en `docs/TRABAJAR_JUNTOS.md`, sección 1. El 16 nov 2026 Rubén no había confirmado si ya es colaborador.

**Pasos.**
1. Mientras tanto: Alejandro agrega a `mrbencho` como colaborador.
2. Decidir el nombre de la organización. Opción: que sea la de Nordeste Salvaje, con este repositorio adentro, porque el proyecto es suyo.
3. Crear la organización; los dos como dueños.
4. Transferir el repositorio y activar GitHub Pages en la organización.
5. Proteger `main`: todo entra por PR con una aprobación.
6. Actualizar los enlaces en `README.md` y `docs/CONTEXTO.md`.

**Hecho cuando.** La página carga en la dirección nueva, el enlace viejo redirige, los dos pueden aprobar un PR y un `push` directo a `main` es rechazado.
