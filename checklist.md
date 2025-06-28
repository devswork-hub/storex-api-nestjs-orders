Projeto FreteDados

- Configuração de ambiente de desenvolvimento

  - [x] VSCode
    - [x] Plugins
    - [x] Temas e outros
  - [x] Eslint e Prettier
  - [x] CommitLint e Git Hooks

- Testes

  - [x] Configuração de testes
  - [x] Configurações globais (document, window, Location, nextrouter)
  - Testes de unidade
  - Testes de integracao
  - Cobertura de testes com Sonarqube

- Separação lógica de módulos e features

  - App Module (Nest.js Definitions)
    - Config Module (Schema, Validation Schema & .env and Module )
    - Interceptors Module
    - Persistence Module
      - Mongoose Module Definitions
    - Utils
  - Logic Modules
    - Order Module (Bounded Context)
      - Application Module
        - Graphql Definitions (Inputs, Outputs, Resolvers, GQLs, (...))
        - Mongo & Mongoose Definitions (Documents, Subdocumets, Schemas, Seeders, Repository, Mappers, (...) )
      - Domain Modulo (Logical Business Module)
        - Persistence (Order Repository Contract, In Memory Repository, (...))
          > Define contratos de repositório, implementações em memória para testes, etc.
        - Usecases
          > Implementação dos casos de uso do domínio, orquestrando regras de negócio e persistência
        - Utils
        - Constants
        - Contracts

- Padroes de Projetos

  - POO (Orientacao a Objetos)
    - F-Bounded, Generics, Abstract Class, Class, Polymorphis, Herança, (...)
  - DDD (Domain Drive Design)
    - Aggregates, Entities, Repositories
  - Clean Arch + Feature Slice + Feature Driven
    - Usecases, Application Layer, Domain layer, Persistence layer, Modules, Features, (...)
  - CQRS
    - Domain Events, Generic Events

- Logging
- Metrics, Obserbality, Tracing

  - Kibana, Grafana,

- Message
  - Kafka, Redpanda, Zookeeper, (...)
