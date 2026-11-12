# Cómo trabajamos juntos (GitHub + agentes)

## 1. Una casa propia para el proyecto (una vez)

1. Uno de los dos crea una **organización gratuita** en GitHub: github.com/organizations/plan/free → nombre sugerido
   `fauna-en-la-via` (o el que elijan). Los dos quedan como **Owner**.
2. Alejandro **transfiere** el repo `buflowart/fauna-en-la-via` a la organización
   (Settings → General → Danger Zone → Transfer). Se conserva todo el historial; GitHub redirige el link viejo.
3. Activar GitHub Pages en la organización: la página queda en `https://<org>.github.io/fauna-en-la-via/`
   y deja de estar en la cuenta de Buflow.
4. Proteger `main` (Settings → Branches): nadie empuja directo, todo entra por Pull Request con 1 aprobación.

Por qué una organización y no la cuenta de uno: el proyecto no depende de la cuenta personal de nadie, se pueden sumar
voluntarios y, cuando exista la asociación, ya tiene su casa.

## 2. El día a día

- **Issues = la lista de tareas.** Cada tarea del plan es un issue. Quien la toma se la asigna. El tablero (GitHub
  Project) muestra Por hacer / En curso / En revisión / Hecho.
- **Una rama por tarea**: `git switch -c 12-reportes-en-base` (número del issue + nombre corto).
- **Pull Request** cuando está lista, con "Closes #12" en la descripción. El otro la revisa (o un agente revisor con
  `/code-review`) y la aprueba. Recién ahí se fusiona.
- **Antes de empezar cada día**: `git switch main` + `git pull`. Evita pisarse.
- Cada uno con su propio Claude Code y su propia cuenta. El repo tiene un `CLAUDE.md` que los dos agentes leen al
  entrar: así los dos trabajan con las mismas reglas sin tener que repetírselas.

## 3. Quién hace qué (natural, no rígido)

| Rubén | Alejandro |
|---|---|
| Decide qué se mide y qué se publica | Web, mapa, base de datos, análisis con scripts |
| Datos, terreno, coordinar la validación con biólogos aliados | Agentes de IA, automatizaciones |
| Contactos: ANLA, Corantioquia, universidad, Recosfa | Revisión técnica de los PR |
| Revisa todo lo que dice algo científico o legal | Diseño de campañas y piezas |

Regla: lo que sale afuera (un documento a la ANLA, una postulación, un post) lo aprueban **los dos**.

## 4. Lo que no va al repo

- Claves, tokens, contraseñas → `.env` (en `.gitignore`) o los *Secrets* de GitHub.
- Datos personales de quienes reportan y fotos sin permiso.
- Datos crudos pesados (rasters) → fuera de git; en el repo solo el script que los baja y genera la capa.

## 5. Con qué modelo

Ver la tabla en `docs/METODO.md` (la escribe Fable). Resumen: Opus para decidir y revisar lo que sale afuera, Sonnet
para ejecutar tareas bien escritas, Haiku para lo mecánico. Quien construye no se aprueba a sí mismo.
