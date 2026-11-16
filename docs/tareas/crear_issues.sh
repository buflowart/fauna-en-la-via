#!/usr/bin/env bash
# Sube las tareas de docs/tareas/ como issues de GitHub, con etiquetas.
# Requiere la CLI de GitHub autenticada: gh auth login
# Uso, desde la raíz del repositorio:  bash docs/tareas/crear_issues.sh
# Correrlo UNA sola vez: no revisa si el issue ya existe.
set -euo pipefail

command -v gh >/dev/null || { echo "Falta la CLI de GitHub (gh)."; exit 1; }
gh auth status >/dev/null || { echo "Primero: gh auth login"; exit 1; }

campo() { sed -n "s/^$2: *//p" "$1" | head -n 1; }
etiqueta() { gh label create "$1" --force >/dev/null; }

for f in docs/tareas/[0-9]*.md; do
  titulo=$(grep -m 1 '^# ' "$f" | sed 's/^# //')
  frente=$(campo "$f" frente)
  tamano=$(campo "$f" tamano)
  modelo=$(campo "$f" modelo | cut -d' ' -f1 | tr -d ',;')
  dueno=$(campo "$f" dueno | cut -d',' -f1 | cut -d' ' -f1)

  etiquetas="frente:$frente,tamaño:$tamano,modelo:$modelo,dueño:$dueno"
  IFS=',' read -ra lista <<< "$etiquetas"
  for e in "${lista[@]}"; do etiqueta "$e"; done

  # El cuerpo del issue es la tarea sin el encabezado de metadatos.
  cuerpo=$(awk 'BEGIN{n=0} /^---$/{n++; next} n>=2' "$f")
  gh issue create --title "$titulo" --body "$cuerpo

Archivo de la tarea: \`$f\`" --label "$etiquetas"
  echo "Creado: $titulo"
done
