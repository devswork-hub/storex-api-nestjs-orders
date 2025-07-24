## Título

Adotar Scope.REQUEST para serviços que dependem de contexto da requisição (ex: transação, usuário)

## Status

Aceito

## Contexto

A aplicação possui operações que precisam de contexto isolado por requisição, como:

- Compartilhamento de uma transação única entre múltiplos serviços
- Acesso ao usuário logado ou informações da requisição
- Operações que devem ser isoladas por request (evitando estado compartilhado)

Atualmente, é necessário passar manualmente o queryRunner ou user entre serviços, o que gera acoplamento e repetição de código.

# Decisão

Utilizar @Injectable({ scope: Scope.REQUEST }) em serviços que:

- Precisam de contexto da requisição atual
- Precisam compartilhar uma instância de algo (como transação) entre classes
- Desejam acessar Request, User, etc., via injeção de dependência

Esses serviços terão ciclo de vida limitado à requisição, e seus recursos serão descartados ao final dela.

## Consequências

`Positivas:`

- Maior isolamento por requisição
- Código mais limpo (sem precisar passar queryRunner, user etc.)
- Facilita a arquitetura modular com serviços reutilizáveis
- Boa integração com interceptors e middlewares

`Negativas:`

- Aumenta complexidade de instância (uma nova por request)
- Pode impactar performance se mal utilizado
- Exige configuração especial para testes unitários e e2e
