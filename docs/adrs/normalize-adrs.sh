#!/usr/bin/env bash
set -euo pipefail

ADR_DIR="./docs/adrs"

if [ ! -d "$ADR_DIR" ]; then
  echo "Pasta $ADR_DIR não encontrada!"
  exit 1
fi

# pega o maior número já existente
last_number=$(ls "$ADR_DIR" | grep -Eo '^ADR-[0-9]+' | sed 's/ADR-//' | sort -n | tail -1 || true)
if [ -z "$last_number" ]; then
  last_number=0
fi

# função para slugify
slugify() {
  local input="$*"
  if command -v iconv >/dev/null 2>&1; then
    echo "$input" | iconv -t ascii//TRANSLIT 2>/dev/null | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g'
  else
    echo "$input" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g' | sed -E 's/^-+|-+$//g'
  fi
}

echo "🔍 Normalizando ADRs em $ADR_DIR..."

for file in "$ADR_DIR"/*.md; do
  base=$(basename "$file")
  
  if [[ "$base" =~ ^ADR-[0-9]{3}-.+\.md$ ]]; then
    echo "✅ OK: $base"
    continue
  fi

  # remove prefixo errado (ex: ARD- -> ADR-)
  clean_name=$(echo "$base" | sed -E 's/^ARD-/ADR-/')

  # remove prefixo ADR- se não tiver número
  title_part=$(echo "$clean_name" | sed -E 's/^ADR-//; s/\.md$//')

  # slugify a parte textual
  slug=$(slugify "$title_part")

  # gera novo número sequencial
  last_number=$((last_number + 1))
  new_name="ADR-$(printf "%03d" "$last_number")-$slug.md"

  echo "♻️  Renomeando: $base -> $new_name"
  mv "$file" "$ADR_DIR/$new_name"
done

echo "✨ Normalização concluída!"
