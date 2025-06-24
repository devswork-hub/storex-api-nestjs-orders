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
