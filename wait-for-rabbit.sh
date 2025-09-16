#!/bin/sh
set -e

host="${RABBITMQ_HOST:-rabbitmq}"
port="${RABBITMQ_PORT:-5672}"

echo "⏳ Esperando RabbitMQ em $host:$port..."

# tenta conectar até conseguir
until nc -z "$host" "$port"; do
  sleep 2
done

echo "✅ RabbitMQ disponível! Subindo aplicação NestJS..."

exec "$@"
