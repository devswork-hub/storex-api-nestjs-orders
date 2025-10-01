# #!/bin/bash
# set -e

# # Carrega variáveis do .env.docker
# set -a
# source .env.docker
# set +a

# # echo "Esperando Elasticsearch ficar pronto..."
# # until curl -s -u "elastic:$ELASTIC_PASSWORD" "http://localhost:9200/_cluster/health?wait_for_status=yellow" >/dev/null; do
# #   echo "Ainda aguardando Elasticsearch..."
# #   sleep 5
# # done

# echo "Configurando senha do kibana_system..."
# curl -s -X POST "http://localhost:9200/_security/user/kibana_system/_password" \
#   -u "elastic:$ELASTIC_PASSWORD" \
#   -H "Content-Type: application/json" \
#   -d "{\"password\":\"$KIBANA_SYSTEM_PASSWORD\"}"

# echo "Configurando senha do logstash_system..."
# curl -s -X POST "http://localhost:9200/_security/user/logstash_system/_password" \
#   -u "elastic:$ELASTIC_PASSWORD" \
#   -H "Content-Type: application/json" \
#   -d "{\"password\":\"$LOGSTASH_SYSTEM_PASSWORD\"}"

# echo "Configurando senha do beats_system..."
# curl -s -X POST "http://localhost:9200/_security/user/beats_system/_password" \
#   -u "elastic:$ELASTIC_PASSWORD" \
#   -H "Content-Type: application/json" \
#   -d "{\"password\":\"$BEATS_SYSTEM_PASSWORD\"}"

# echo "Senhas configuradas com sucesso!"



--- FUNCIONAL ---
#!/usr/bin/env bash
set -e

# Carrega variáveis do .env.docker
set -a
source .env.docker
set +a

echo "Esperando Elasticsearch ficar pronto..."

while ! curl -s -u "elastic:$ELASTIC_PASSWORD" "http://localhost:9200/_cluster/health?wait_for_status=yellow" >/dev/null; do
  echo "Esperando Elasticsearch..."
  sleep 5
done

echo $KIBANA_SYSTEM_PASSWORD

echo "Configurando senha do kibana_system..."
# curl -s -X POST "http://localhost:9200/_security/user/kibana_system/_password" \
#   -u "elastic:$ELASTIC_PASSWORD" \
#   -H "Content-Type: application/json" \
#   -d "{\"password\":\"$KIBANA_SYSTEM_PASSWORD\"}"

curl -X POST "http://localhost:9200/_security/user/kibana_system/_password" \
  -H "Content-Type: application/json" \
  -u elastic:senhadoelastic \
  -d '{"password":"KibanaSys123!"}'

echo "Configurando senha do logstash_system..."
# curl -s -X POST "http://localhost:9200/_security/user/logstash_system/_password" \
#   -u "elastic:$ELASTIC_PASSWORD" \
#   -H "Content-Type: application/json" \
#   -d "{\"password\":\"$LOGSTASH_SYSTEM_PASSWORD\"}"

curl -X POST "http://localhost:9200/_security/user/logstash_system/_password" \
  -H "Content-Type: application/json" \
  -u elastic:senhadoelastic \
  -d '{"password":"LogstashSys123!"}'


echo "Configurando senha do beats_system..."
# curl -s -X POST "http://localhost:9200/_security/user/beats_system/_password" \
#   -u "elastic:$ELASTIC_PASSWORD" \
#   -H "Content-Type: application/json" \
#   -d "{\"password\":\"$BEATS_SYSTEM_PASSWORD\"}"

curl -X POST "http://localhost:9200/_security/user/beats_system/_password" \
  -H "Content-Type: application/json" \
  -u elastic:senhadoelastic \
  -d '{"password":"BeatsSys123!!"}'


echo "Senhas configuradas com sucesso!"



# --- IGNORE ---
# #!/bin/bash
# set -e

# # Carrega variáveis do .env
# export $(grep -v '^#' .env.docker | xargs)

# # Espera o Elasticsearch iniciar
# until curl -s -u elastic:$ELASTIC_PASSWORD http://localhost:9200 >/dev/null; do
#   echo "Esperando Elasticsearch..."
#   sleep 5
# done

# echo "Configurando usuários internos..."

# # Kibana System
# curl -s -X POST "http://localhost:9200/_security/user/kibana_system/_password" \
#   -u elastic:$ELASTIC_PASSWORD -H "Content-Type: application/json" \
#   -d "{\"password\":\"$KIBANA_SYSTEM_PASSWORD\"}"

# # Logstash System
# curl -s -X POST "http://localhost:9200/_security/user/logstash_system/_password" \
#   -u elastic:$ELASTIC_PASSWORD -H "Content-Type: application/json" \
#   -d "{\"password\":\"$LOGSTASH_SYSTEM_PASSWORD\"}"

# # Beats System
# curl -s -X POST "http://localhost:9200/_security/user/beats_system/_password" \
#   -u elastic:$ELASTIC_PASSWORD -H "Content-Type: application/json" \
#   -d "{\"password\":\"$BEATS_SYSTEM_PASSWORD\"}"

# echo "Todos os usuários internos foram configurados!"
# echo "Kibana System Password: $KIBANA_SYSTEM_PASSWORD"
# echo "Logstash System Password: $LOGSTASH_SYSTEM_PASSWORD"
# echo "Beats System Password: $BEATS_SYSTEM_PASSWORD"