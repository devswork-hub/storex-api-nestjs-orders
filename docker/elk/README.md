# Stack ELK 9.1.4 - Configuração Completa

Esta configuração inclui toda a stack ELK (Elasticsearch, Logstash, Kibana) com os beats (Filebeat, Metricbeat, Heartbeat) e APM Server, todos na versão 9.1.4.

## Componentes Incluídos

- **Elasticsearch 9.1.4**: Motor de busca e análise
- **Logstash 9.1.4**: Processamento de dados
- **Kibana 9.1.4**: Interface de visualização
- **Filebeat 9.1.4**: Coleta de logs
- **Metricbeat 9.1.4**: Coleta de métricas
- **Heartbeat 9.1.4**: Monitoramento de disponibilidade
- **APM Server 9.1.4**: Application Performance Monitoring
- **Fleet Server 9.1.4**: Gerenciamento centralizado de agentes

## Configurações Principais

### Credenciais
- **Usuário**: `elastic`
- **Senha**: `ChangeMeElastic123!`

### Portas
- Elasticsearch: `9200`
- Kibana: `5601`
- Logstash: `5044`
- APM Server: `8200`
- Fleet Server: `8220`

## Como Usar

### 1. Iniciar a Stack ELK
```bash
docker-compose -f docker-compose.elk.yml up -d
```

### 2. Verificar Status dos Serviços
```bash
docker-compose -f docker-compose.elk.yml ps
```

### 3. Acessar Kibana
- URL: http://localhost:5601
- Usuário: `elastic`
- Senha: `ChangeMeElastic123!`

### 4. Acessar Elasticsearch
- URL: http://localhost:9200
- Usuário: `elastic`
- Senha: `ChangeMeElastic123!`

### 5. Acessar APM Server
- URL: http://localhost:8200

## Configurações Específicas

### Elasticsearch
- Modo single-node para desenvolvimento
- Segurança habilitada com SSL desabilitado para desenvolvimento
- Memória: 1GB (configurável via ES_JAVA_OPTS)

### Logstash
- Pipeline configurado para receber dados do Filebeat
- Processamento de logs com filtros Ruby e KV
- Output para Elasticsearch com autenticação

### Filebeat
- Auto-discovery de containers Docker
- Coleta logs de containers com label `filebeat_collector: true`
- Output para Logstash

### Metricbeat
- Módulos: Docker, Elasticsearch, System
- Coleta métricas de containers e sistema
- Output direto para Elasticsearch

### Heartbeat
- Monitoramento HTTP e ICMP
- Verifica disponibilidade dos serviços principais
- Output para Elasticsearch

### APM Server
- Recebe dados de APM de aplicações
- Integração com Kibana para visualização
- Source maps habilitados

## Troubleshooting

### Verificar Logs
```bash
# Logs do Elasticsearch
docker-compose -f docker-compose.elk.yml logs elasticsearch

# Logs do Kibana
docker-compose -f docker-compose.elk.yml logs kibana

# Logs do Logstash
docker-compose -f docker-compose.elk.yml logs logstash
```

### Verificar Conectividade
```bash
# Testar Elasticsearch
curl -u elastic:ChangeMeElastic123! http://localhost:9200/_cluster/health

# Testar Kibana
curl -u elastic:ChangeMeElastic123! http://localhost:5601/api/status
```

### Resetar Volumes (CUIDADO - Remove todos os dados)
```bash
docker-compose -f docker-compose.elk.yml down -v
docker volume prune -f
```

## Integração com Aplicação NestJS

Para que sua aplicação NestJS envie logs para o ELK, certifique-se de que o container tenha a label:
```yaml
labels:
  filebeat_collector: true
```

A aplicação já está configurada no `docker-compose.dev.yml` com essa label.

## Monitoramento

- **Logs**: Visualizados no Kibana em `Stack Management > Index Patterns`
- **Métricas**: Disponíveis em `Observability > Metrics`
- **APM**: Disponível em `Observability > APM`
- **Uptime**: Disponível em `Observability > Uptime`
