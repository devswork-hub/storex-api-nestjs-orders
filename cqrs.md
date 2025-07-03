Como fica o fluxo CQRS com GraphQL?

- Cliente envia query ou mutation GraphQL.
- Resolver recebe os argumentos, valida e converte para DTO (opcional, pode usar os tipos GraphQL direto).
- Resolver cria uma Query ou Command do CQRS com esses dados.
- Resolver chama queryBus.execute() ou commandBus.execute().
- O QueryHandler ou CommandHandler processa e retorna o resultado.
- Resolver retorna o resultado para o cliente GraphQL.

Por que usar QueryHandler/CommandHandler?

1. Separação clara de responsabilidades
   Resolver (ou controller): recebe a requisição, valida input, e encaminha a operação.
   QueryHandler / CommandHandler: implementa a lógica específica daquela operação, mantendo o código organizado, testável e desacoplado da interface.
   Assim você evita que seu resolver/controller vire um monstro que faz tudo.

2. Facilita testes isolados
   Com handlers separados, você pode testar a lógica da consulta (query) ou comando sem precisar envolver toda a camada de transporte (GraphQL, REST).
   Isso melhora a qualidade do código e facilita manutenção.
3. Escalabilidade do código
   Conforme o sistema cresce, centralizar a lógica nos handlers permite manter tudo modular.
   Vários handlers diferentes para vários comandos e queries, sem misturar com a camada de transporte.
4. Permite cross-cutting concerns facilmente
   Você pode adicionar middlewares, interceptors, logging, caching, validações extras, etc, no nível do bus (CommandBus/QueryBus) e handlers, sem precisar tocar no resolver.
5. Padrão arquitetural robusto
   CQRS é uma arquitetura comprovada para sistemas complexos, que precisam escalar, ter separação de leitura/escrita, e trabalhar com eventos.
   Usar handlers prepara seu código para evoluir nessa direção.
   Quando não precisa usar QueryHandler?

Se seu projeto é pequeno, simples, protótipo, e você tem poucos casos de uso, pode processar direto no resolver/controller.
Se o overhead de separar comandos/queries é maior que o benefício, comece simples.
Quando vale muito a pena usar?

Projetos maiores, com regras complexas.
Quando há muita lógica por trás dos comandos ou queries.
Quando você precisa desacoplar código, ter mais testes, ou usar features como eventos, logs, métricas centralizadas.

Por que usar QueryHandler/CommandHandler?

1. Separação clara de responsabilidades
   Resolver (ou controller): recebe a requisição, valida input, e encaminha a operação.
   QueryHandler / CommandHandler: implementa a lógica específica daquela operação, mantendo o código organizado, testável e desacoplado da interface.
   Assim você evita que seu resolver/controller vire um monstro que faz tudo.

2. Facilita testes isolados
   Com handlers separados, você pode testar a lógica da consulta (query) ou comando sem precisar envolver toda a camada de transporte (GraphQL, REST).
   Isso melhora a qualidade do código e facilita manutenção.
3. Escalabilidade do código
   Conforme o sistema cresce, centralizar a lógica nos handlers permite manter tudo modular.
   Vários handlers diferentes para vários comandos e queries, sem misturar com a camada de transporte.
4. Permite cross-cutting concerns facilmente
   Você pode adicionar middlewares, interceptors, logging, caching, validações extras, etc, no nível do bus (CommandBus/QueryBus) e handlers, sem precisar tocar no resolver.
5. Padrão arquitetural robusto
   CQRS é uma arquitetura comprovada para sistemas complexos, que precisam escalar, ter separação de leitura/escrita, e trabalhar com eventos.
   Usar handlers prepara seu código para evoluir nessa direção.
   Quando não precisa usar QueryHandler?

Se seu projeto é pequeno, simples, protótipo, e você tem poucos casos de uso, pode processar direto no resolver/controller.
Se o overhead de separar comandos/queries é maior que o benefício, comece simples.
Quando vale muito a pena usar?

Projetos maiores, com regras complexas.
Quando há muita lógica por trás dos comandos ou queries.
Quando você precisa desacoplar código, ter mais testes, ou usar features como eventos, logs, métricas centralizadas.

Em resumo

Com CQRS (com handlers) Sem CQRS (resolver faz tudo)
Resolver só recebe e encaminha Resolver recebe e processa tudo
Handler faz toda a lógica de negócio Resolver tem a lógica junto
Código organizado e desacoplado Código misturado e difícil de escalar
Fácil testar handlers isoladamente Testes mais difíceis e acoplados

---

Seu fluxo atual (sem QueryHandler)

GraphQL -> Resolver -> UseCase -> Repository
Passo a passo:

Cliente faz uma query GraphQL para buscar dados (ex: pedido).
O resolver recebe essa query e os argumentos (ex: orderId).
O resolver chama diretamente o UseCase (ex: getOrderUseCase.execute(orderId)).
O UseCase executa a lógica e chama o repository para buscar os dados no banco.
Os dados são retornados pelo UseCase ao resolver.
O resolver retorna os dados para o cliente.
Fluxo com QueryHandler (usando CQRS)

GraphQL -> Resolver -> QueryBus -> QueryHandler -> UseCase -> Repository
Passo a passo:

Cliente faz uma query GraphQL para buscar dados (ex: pedido).
O resolver recebe essa query e os argumentos.
O resolver cria uma Query (objeto), por exemplo, GetOrderQuery(orderId).
O resolver chama o QueryBus.execute() passando essa Query.
O NestJS encontra o QueryHandler correspondente (ex: GetOrderHandler).
O QueryHandler executa, chama o UseCase (getOrderUseCase.execute(orderId)).
O UseCase executa a lógica e chama o repository para buscar os dados no banco.
O resultado volta do UseCase para o QueryHandler, para o QueryBus, para o resolver.
O resolver retorna os dados para o cliente.
Diferenças principais

Aspecto Sem QueryHandler Com QueryHandler
Chamadas Resolver chama UseCase direto Resolver chama QueryBus, que chama Handler
Separação Menos camadas, lógica próxima do resolver Camadas separadas, lógica organizada
Cross-cutting Precisa implementar direto no resolver Pode usar interceptors, middlewares no bus
Testabilidade Testa resolver/UseCase juntos Testa QueryHandler isoladamente
Escalabilidade Menos escalável, mais acoplado Mais preparado para crescimento e evoluçã
