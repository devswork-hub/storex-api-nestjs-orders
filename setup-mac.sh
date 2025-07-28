#!/bin/bash

# Lista dos arquivos de perfil onde os aliases serão configurados
# Ajuste esta lista se você tiver outros arquivos de perfil específicos.
PROFILE_FILES=(
    "$HOME/.bash_profile"
    "$HOME/.zprofile"
    "$HOME/.zshrc"
)

echo "Configurando aliases Git em múltiplos perfis..."

# Lista de aliases a serem adicionados
declare -A aliases=(
    ["gl"]="git pull"
    ["gp"]="git push"
    ["gs"]="git status"
    ["gb"]="git branch"
    ["gco"]="git checkout"
    ["gcb"]="git checkout -b"
    ["gd"]="git diff"
    ["ga"]="git add ."
    ["gc"]="git commit"
    ["gcm"]="git commit -m"
)

# Itera sobre cada arquivo de perfil
for PROFILE_FILE in "${PROFILE_FILES[@]}"; do
    echo "" # Linha em branco para melhor leitura
    echo "Processando: $PROFILE_FILE"

    # Verifica se o arquivo de perfil existe. Se não existir, cria um.
    if [ ! -f "$PROFILE_FILE" ]; then
        touch "$PROFILE_FILE"
        echo "Arquivo '$PROFILE_FILE' criado."
    fi

    # Adiciona cada alias se ele ainda não existir no arquivo de perfil
    for alias_name in "${!aliases[@]}"; do
        alias_command="${aliases[$alias_name]}"
        if ! grep -q "alias $alias_name=" "$PROFILE_FILE"; then
            echo "alias $alias_name='$alias_command'" >> "$PROFILE_FILE"
            echo "  Alias '$alias_name' adicionado."
        else
            echo "  Alias '$alias_name' já existe."
        fi
    done
done

echo "" # Linha em branco para melhor leitura
echo "Configuração de aliases Git concluída em todos os perfis especificados."
echo "Para aplicar as mudanças, por favor, reinicie seu terminal ou execute um dos seguintes comandos (conforme seu shell ativo):"
echo "  source ~/.bash_profile"
echo "  source ~/.zprofile"
echo "  source ~/.zshrc"