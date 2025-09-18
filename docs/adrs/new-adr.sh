#!/usr/bin/env bash
set -euo pipefail

# onde está o script
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# detectar adrs em várias possibilidades
if [ -d "./adrs" ]; then
  ADR_DIR="$(pwd)/adrs"
elif [ -d "./docs/adrs" ]; then
  ADR_DIR="$(pwd)/docs/adrs"
elif [ -d "$script_dir/adrs" ]; then
  ADR_DIR="$script_dir/adrs"
elif [ "$(basename "$script_dir")" = "adrs" ]; then
  ADR_DIR="$script_dir"
else
  # padrão: cria adrs ao lado do script
  ADR_DIR="$script_dir/adrs"
fi

# cria se não existir
if [ ! -d "$ADR_DIR" ]; then
  mkdir -p "$ADR_DIR"
  echo "Pasta criada: $ADR_DIR"
fi

# pega último número (maior existente)
last_number=$(ls "$ADR_DIR" 2>/dev/null | grep -Eo 'ADR-([0-9]+)' | sed 's/ADR-//' | sort -n | tail -n1 || true)
if [ -z "$last_number" ]; then
  last_number=0
fi
next_number=$((last_number + 1))

# título: argumento ou prompt
if [ $# -gt 0 ]; then
  title="$*"
else
  read -r -p "Digite o título do ADR: " title
fi

# slugify (remove acentos se possível)
if command -v iconv >/dev/null 2>&1; then
  slug=$(echo "$title" | iconv -t ascii//TRANSLIT 2>/dev/null | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')
else
  slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g')
fi

# capitaliza título (simples: inicial de cada palavra)
title_cap=$(echo "$title" | sed -E 's/^[ \t]+|[ \t]+$//g' | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) tolower(substr($i,2)) }}1')

# nome do arquivo com padding 3 dígitos
filename="$ADR_DIR/ADR-$(printf "%03d" "$next_number")-${slug}.md"

# template
cat > "$filename" <<EOF
# ADR-$(printf "%03d" "$next_number"): $title_cap

## Status
Proposed

## Contexto
Descreva aqui o contexto e o problema que motiva esta decisão.

## Decisão
Explique qual decisão foi tomada.

## Consequências
Liste os impactos (positivos e negativos) dessa decisão.
EOF

echo "ADR criado: $filename"
