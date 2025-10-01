#!/bin/sh
set -e

# Espera o Elasticsearch subir
until curl -s -u elastic:senhadoelastic http://localhost:9200 >/dev/null 2>&1; do
  echo "Esperando Elasticsearch subir..."
  sleep 5
done

echo "Elasticsearch ativo. Configurando usuários internos..."

# Senhas desejadas
KIBANA_SYSTEM_PASSWORD="senhakibana"
LOGSTASH_SYSTEM_PASSWORD="senhalogstash"
BEATS_SYSTEM_PASSWORD="senhabeats"

# Kibana system
/usr/share/elasticsearch/bin/elasticsearch-reset-password -u kibana_system -b --password "$KIBANA_SYSTEM_PASSWORD"

# Logstash system
/usr/share/elasticsearch/bin/elasticsearch-reset-password -u logstash_system -b --password "$LOGSTASH_SYSTEM_PASSWORD"

# Beats system
/usr/share/elasticsearch/bin/elasticsearch-reset-password -u beats_system -b --password "$BEATS_SYSTEM_PASSWORD"

echo "Usuários internos configurados!"
exec /usr/local/bin/docker-entrypoint.sh
