## Decisoes de arquitetura

- Postgres para transacoes ACID (Command Side)
  - Otimo para usar Outbox
    - Uso de triggers, extensões como o pg_notify, ou simplesmente tabelas para gerenciar o Outbox
  - Modelagem mais precisa
    - Relacionamentos bem definidos
- MongoDB com Redis para consultas otimizadas (Query Side)
  - Nao recomendado para transacoes:
    - Overhead;
      - Transações multi-documento no MongoDB podem introduzir latência e impactar o desempenho, especialmente em alta escala.
    - Necessidade de rodar em modo replicaset;
      - As transações no MongoDB exigem um conjunto de réplicas, o que é uma configuração padrão, mas vale a pena mencionar como um requisito.
    - "Desnormalizacao excessiva"
      - É o que permite consultas otimizadas e rápidas, pois os dados são pré-agregados e otimizados para leitura, evitando joins complexos em tempo de execução.
    - Pegadinha do achismo "Permite esquema mais flexivel"
      - A "flexibilidade de esquema" do NoSQL pode levar a uma má modelagem se não for bem compreendida
- Redis
  - A inclusão do Redis é inteligente para camadas de cache, contadores rápidos, ou até mesmo como um "read-through cache" para o MongoDB para consultas de altíssima frequência.
- Comunicação entre Command e Query Side
  - Embora não esteja explícito nas conclusões, a implicação de ter sistemas separados (Postgres e MongoDB) é a necessidade de um mecanismo para sincronizar os dados do Command Side para o Query Side. Isso geralmente é feito através de eventos (event sourcing ou event-driven architecture), onde as mudanças no Postgres (após uma transação bem-sucedida) disparam eventos que são consumidos por um serviço que atualiza o MongoDB.
- Desnormalização no Query Side
  - Reforçando o ponto da desnormalização, para o Query Side, o objetivo é otimizar a leitura. Isso significa que você pode ter dados duplicados ou pré-calculados em diferentes coleções/documentos no MongoDB para atender a diferentes padrões de consulta sem a necessidade de operações de agregação complexas em tempo real.
- Monitoramento e Observabilidade
  - Com uma arquitetura distribuída como essa, monitorar a consistência eventual e o desempenho de ambos os lados (Postgres e MongoDB) se torna ainda mais crítico.

### Sobre esse projeto

- Inclui

  - Analise e formatacao estatica de codigo com Eslint e Prettier
  - Custom Exceptions, Error Handling
  - Documentacao do proprio GraphQL
    Outbox Pattern
  - Coreografia com Sagas
  - Uso correto de CQRS
  - Gerenciamento de Cache com Cache-Manager e Redis
  - Event Driven
    - Resiliencia nas entregas
    - Atomicidade (ACID) das transacoes de criacao, usando
      - Idempotência de eventos
    - Consistencia eventual em casos especificos

- A nivel de aplicacao

  - Uso de libs externas criadas com os mecanismos do Nest.js
  - Custom Configuration
  - Interceptors
  - Persistence Module
    - Cache
    - Outbox Pattern (incluindo esquemas e logicas)
    - Redis
  - Servicos
    - Kafka
    - RabbitMQ
  - E modulos compartilhados (Shared)

- A nivel de conversao de logica de dominio para requisitos de software

  - Separacao por modulos (geralmente representam os Bounded Contexts)
  - Mescla de abordagens com Package By Feature e Vertical Slice Design
  - Domain Drive Design adaptado a nivel de codigo
  - Clean Architecture do jeito certo (aproveitando algumas partes que fazem sentido)

- Testes
  - Test Data Builder
  - Integration Tests com Testcontainers

### API Terms

- Resource
- Request
- Response
- Response Code
- Payload
- Pagination
- Method
- Query Parameters
- Authentication
- Rate Limiting
- API Integration
- API Gateway
- API Lifecycle
- CRUD
- Cache
- Client

### Includes

- ⬜️| Nope
- ✅| Yep

- API Gateway

  - ⬜️| unified entry point
  - ⬜️| request routing, load balancing, SSL termination, caching, rate limiting, and sometimes authentication
  - ⬜️| Kong, AWS API Gateway, NGINX, and Spring Cloud Gateway

- Service Registry and Discovery

  - ⬜️| Consul
  - ⬜️| Eureka
  - ⬜️| Apache Zookeeper

- Authentication & Authorization

  - ⬜️| Manage identity (users, roles, scopes)
  - ⬜️| Issue and validate access tokens (JWT, OAuth2)
  - ⬜️| Enforce access control policies
  - ⬜️| Keycloak
  - ⬜️| Okta
  - ⬜️| Auth0
  - ⬜️| Azure AD

- Data Storage

  - ✅| MongoDB
  - ⬜️| Redis
    - ⬜️|Frequently accessed data (e.g., product catalogs, access tokens)
    - ⬜️|Session storage
    - ⬜️|Rate-limiting or token validation
      - Usei o algoritmo token bucket para proteger as rotas públicas contra abusos de alguns IPs com alto volume de requisições.

- Asynchronous Communication

  - ⬜️| Amazon SNS/SQS
  - ⬜️| Kafka
    - ⬜️|Sending notifications
    - ⬜️|Logging analytics events
    - ⬜️|Processing transactions in stages

- Metrics Collection and Visualization

  - ⬜️| Prometheus (metrics collection)
  - ⬜️| Grafana (dashboards and alerts)
    - ⬜️|Sending notifications
    - ⬜️|Logging analytics events
    - ⬜️|Processing transactions in stages

- Log Aggregation and Visualization

  - ⬜️| Logstash (collects and processes logs)
  - ⬜️| Elasticsearch (stores them)
  - ⬜️| Kibana (visualizes logs)

### Referencias

- `Frontend`

  - https://github.com/kyprogramming/shoes-store/tree/master
  - https://github.com/ethanniser/NextFaster/blob/main/src/lib/actions.ts
  - https://github.com/dkrasnovdev/nextjs-app-router-keycloak-example
  - https://daisyui.com/docs/colors/

- ===================================
- [x] https://github.com/desenvolvedor-io/dev-store/blob/main/src/services/DevStore.Orders.Domain/Orders/OrderItem.cs
- https://github.com/thepracticaldeveloper/kafka-spring-boot-example/blob/master/src/main/java/io/tpd/kafkaexample/HelloKafkaController.java
- https://github.com/deyvisonborges/mach-catalog-graphql/blob/main/.k8s/secrets.yaml
- https://github.com/deyvisonborges/fullcycle-codeflix-catalog-api-nestjs/blob/main/package-lock.json
- https://github.com/iluwatar/java-design-patterns
- https://github.com/tomoyane/springboot-bestpractice/tree/master/src

- https://github.com/zhuravlevma/typescript-ddd-architecture/blob/main/src/app.module.ts
- https://github.com/Ho-s/NestJS-GraphQL-TypeORM-PostgresQL/blob/main/src/common/config/graphql-config.service.ts#L39
- https://github.com/amehat/nestjs-cqrs-saga-event-sourcing-domain-driven
- https://github.com/henriqueweiand/nestjs-typeorm-multi-tenancy?source=post_page-----a7f6176e8319---------------------------------------

- `Kafka`

  - https://mosy.tech/spring-boot-kafka-config/

- `Others`
  - https://freedium.cfd/https://medium.com/@bhavyshekhaliya/crud-operations-with-mongodb-nestjs-graphql-656029fd0b25
  - https://medium.com/@bhavyshekhaliya/list/73dca9e4116a
  - https://medium.com/@bhavyshekhaliya/list/99bd343e816a
  - https://www.ayoubkhial.com/blog/crafting-an-efficient-data-layer-with-nestjs-mongoose

#### Domain

- https://docs.klarna.com/api/ordermanagement/
- https://developer.bring.com/api/order-management/
- https://www.codeproject.com/Articles/1094774/Domain-Driven-Design-A-hands-on-Example-Part-of-3
- https://medium.com/@codebob75/domain-driven-design-ddd-from-customer-ideas-to-code-a83a005326e9

#### Docker Compose

- https://medium.com/norsys-octogone/a-local-environment-for-mongodb-with-docker-compose-ba52445b93ed

### Arquitetura de Eventos

- `Rabbit`

  - Configuracao de DLQ
  - Reprocessamento de mensagens:
    - Uso de delayed messages, exponential backoffice retry, retries;
    - Nack e Unack de mensagens;

- `Container`
  - Composes moduleres;
  - Utilitária para reset global;
  - Facilitacao de scripts no package.json;
  - Dockfiler modular;
