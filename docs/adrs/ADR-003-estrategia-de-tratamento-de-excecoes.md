## 1. Título

Centralização do Tratamento de Exceções na Camada de Apresentação com Tradução no Use Case.

## 2. Status

Aceito.

## 3. Contexto

Atualmente, o tratamento de exceções não segue um padrão claro em todas as camadas, podendo levar a blocos try-catch desnecessários e inconsistência nas respostas de erro ao cliente. Precisamos de uma abordagem padronizada para como as exceções são lançadas, capturadas e apresentadas.

## 4. Decisão

Adotaremos a seguinte estratégia para o tratamento de exceções:

- Serviços de Infraestrutura (Repositorios, Cache, etc.): Lançam exceções de baixo nível ou específicas de sua tecnologia (ex: DatabaseError, CacheServiceException, NetworkError). Opcionalmente, podem encapsular erros da biblioteca em exceções mais genéricas de infraestrutura (InternalServerErrorException do NestJS, por exemplo).

- Domínio (Modelos e Value Objects): Lançam exceções de domínio (ValidationException para violação de invariantes, BusinessRuleException para falhas em regras de negócio).

- Use Case (Camada de Aplicação): Possui um bloco try-catch para capturar exceções de domínio e infraestrutura, traduzi-las/mapeá-las para exceções mais genéricas da aplicação (ex: Error com payload JSON estruturado, ApplicationException), e re-lançá-las.

- Command Side (Command Handlers/Controllers): Não terá blocos try-catch explícitos para a lógica de negócio. Permitirá que as exceções lancem para cima (sejam elas exceções de validação de entrada, exceções já traduzidas do Use Case, ou erros inesperados).

- Filtro de Exceções Global (Framework): Uma camada central (como AllExceptionsFilter no NestJS) capturará todas as exceções não tratadas que "escapam" das camadas de Command Side e as transformará em uma resposta padronizada para o cliente (ex: HTTP Status Codes, JSON formatado).

## 5. Motivações

As principais motivações para esta decisão são:

- Separação de Responsabilidades: A lógica de negócio e de infraestrutura lançam exceções, o Use Case as traduz, e o Command Handler as propaga, sem precisar de try-catch verbosos. O filtro global lida com a apresentação final.

- Consistência nas Respostas de Erro: Garante que todos os erros sejam apresentados ao cliente de uma forma padronizada (ex: JSON com statusCode, message, errors detalhados).

- Redução de Duplicação de Código: A lógica de formatação da resposta de erro é centralizada no filtro global, evitando try-catch repetitivos em cada Command Handler.

- Foco nas Responsabilidades da Camada: O Command Handler permanece focado em sua orquestração, sem se preocupar em detalhar o tratamento de exceções.

- Visibilidade e Tratamento de Erros Inesperados: Qualquer erro não capturado ou traduzido por camadas mais baixas será pego pelo filtro global, garantindo que nenhum erro passe despercebido e que o cliente receba uma resposta adequada (ex: 500 Internal Server Error).

## 6. Consequências

Positivas:

- Fluxo de exceções claro e rastreável.
- Melhor experiência do desenvolvedor devido à menor verbosidade nos Command Handlers.
- Respostas de erro consistentes para os consumidores da API.
- Manutenção e depuração facilitadas para o tratamento de erros.

Negativas:

- Exige a configuração de um filtro de exceções global no framework.
- A tradução de exceções no Use Case adiciona uma camada de complexidade que, no entanto, é justificável pelos benefícios de desacoplamento.
