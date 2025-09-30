#!/bin/bash

# Script para gerenciar a Stack ELK 9.1.4

set -e

COMPOSE_FILE="docker-compose.elk.yml"
ELASTIC_USER="elastic"
ELASTIC_PASSWORD="ChangeMeElastic123!"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker não está instalado!"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose não está instalado!"
        exit 1
    fi
}

wait_for_elasticsearch() {
    print_status "Aguardando Elasticsearch ficar disponível..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -u "$ELASTIC_USER:$ELASTIC_PASSWORD" http://localhost:9200/_cluster/health > /dev/null 2>&1; then
            print_success "Elasticsearch está disponível!"
            return 0
        fi
        
        print_status "Tentativa $attempt/$max_attempts - Aguardando Elasticsearch..."
        sleep 10
        ((attempt++))
    done
    
    print_error "Elasticsearch não ficou disponível após $max_attempts tentativas!"
    return 1
}

wait_for_kibana() {
    print_status "Aguardando Kibana ficar disponível..."
    local max_attempts=20
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -u "$ELASTIC_USER:$ELASTIC_PASSWORD" http://localhost:5601/api/status > /dev/null 2>&1; then
            print_success "Kibana está disponível!"
            return 0
        fi
        
        print_status "Tentativa $attempt/$max_attempts - Aguardando Kibana..."
        sleep 10
        ((attempt++))
    done
    
    print_error "Kibana não ficou disponível após $max_attempts tentativas!"
    return 1
}

start_stack() {
    print_status "Iniciando Stack ELK..."
    docker-compose -f $COMPOSE_FILE up -d
    
    if wait_for_elasticsearch && wait_for_kibana; then
        print_success "Stack ELK iniciada com sucesso!"
        print_status "Acesse Kibana em: http://localhost:5601"
        print_status "Usuário: $ELASTIC_USER"
        print_status "Senha: $ELASTIC_PASSWORD"
    else
        print_error "Falha ao iniciar a Stack ELK!"
        exit 1
    fi
}

stop_stack() {
    print_status "Parando Stack ELK..."
    docker-compose -f $COMPOSE_FILE down
    print_success "Stack ELK parada!"
}

restart_stack() {
    print_status "Reiniciando Stack ELK..."
    stop_stack
    sleep 5
    start_stack
}

show_status() {
    print_status "Status dos serviços ELK:"
    docker-compose -f $COMPOSE_FILE ps
}

show_logs() {
    local service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Mostrando logs de todos os serviços..."
        docker-compose -f $COMPOSE_FILE logs -f
    else
        print_status "Mostrando logs do serviço: $service"
        docker-compose -f $COMPOSE_FILE logs -f "$service"
    fi
}

reset_stack() {
    print_warning "ATENÇÃO: Esta operação irá remover TODOS os dados da Stack ELK!"
    read -p "Tem certeza que deseja continuar? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Removendo volumes e containers..."
        docker-compose -f $COMPOSE_FILE down -v
        docker volume prune -f
        print_success "Stack ELK resetada!"
    else
        print_status "Operação cancelada."
    fi
}

test_connectivity() {
    print_status "Testando conectividade..."
    
    # Test Elasticsearch
    if curl -s -u "$ELASTIC_USER:$ELASTIC_PASSWORD" http://localhost:9200/_cluster/health > /dev/null 2>&1; then
        print_success "Elasticsearch: OK"
    else
        print_error "Elasticsearch: FALHA"
    fi
    
    # Test Kibana
    if curl -s -u "$ELASTIC_USER:$ELASTIC_PASSWORD" http://localhost:5601/api/status > /dev/null 2>&1; then
        print_success "Kibana: OK"
    else
        print_error "Kibana: FALHA"
    fi
    
    # Test APM Server
    if curl -s http://localhost:8200 > /dev/null 2>&1; then
        print_success "APM Server: OK"
    else
        print_error "APM Server: FALHA"
    fi
}

show_help() {
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  start     - Inicia a Stack ELK"
    echo "  stop      - Para a Stack ELK"
    echo "  restart   - Reinicia a Stack ELK"
    echo "  status    - Mostra o status dos serviços"
    echo "  logs      - Mostra logs (opcional: especifique o serviço)"
    echo "  test      - Testa conectividade dos serviços"
    echo "  reset     - Remove todos os dados (CUIDADO!)"
    echo "  help      - Mostra esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 start"
    echo "  $0 logs elasticsearch"
    echo "  $0 test"
}

# Main script
check_docker

case "${1:-help}" in
    start)
        start_stack
        ;;
    stop)
        stop_stack
        ;;
    restart)
        restart_stack
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs "$2"
        ;;
    test)
        test_connectivity
        ;;
    reset)
        reset_stack
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Comando inválido: $1"
        show_help
        exit 1
        ;;
esac
