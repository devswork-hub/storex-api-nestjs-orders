# alias docker-reset='docker stop $(docker ps -aq) 2>/dev/null; \
# docker rm -f $(docker ps -aq) 2>/dev/null; \
# docker volume rm $(docker volume ls -q) 2>/dev/null; \
# docker system prune -a --volumes -f'

# docker-reset
#!/bin/bash
set -e

echo "🚫 Parando todos os containers..."
docker stop $(docker ps -aq) 2>/dev/null || true

echo "🗑️ Removendo todos os containers..."
docker rm -f $(docker ps -aq) 2>/dev/null || true

echo "📦 Removendo todos os volumes..."
docker volume rm $(docker volume ls -q) 2>/dev/null || true

echo "🧹 Limpando imagens, redes e cache do Docker..."
docker system prune -a --volumes -f

echo "✅ Docker resetado com sucesso!"
