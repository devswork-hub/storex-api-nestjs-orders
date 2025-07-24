## Título

Evitar o uso de Scope.REQUEST e preferir passagem explícita de contexto (como transação ou usuário)

## Status

Aceito

## Contexto

A aplicação busca manter simplicidade no gerenciamento de dependências e transações. O uso de Scope.REQUEST:

- Pode afetar performance (cria instâncias por requisição)
- Dificulta rastreabilidade em testes
- Adiciona complexidade no ciclo de vida de objetos
  Além disso, o projeto atual permite fácil controle de contexto manual (passando queryRunner, user, etc.).

# Decisão

Não utilizar Scope.REQUEST no momento. Em vez disso:

- Utilizar transações com queryRunner passado explicitamente
- Passar manualmente informações do usuário ou da requisição quando necessário
- Manter serviços como singletons (Scope.DEFAULT)

## Consequências

`Positivas:`

- Maior previsibilidade do ciclo de vida das instâncias
- Menor sobrecarga de criação de objetos
- Código mais simples para testar e debugar
- Evita necessidade de configurações avançadas para escopos

`Negativas:`

- Pode resultar em mais código repetido (passagem manual)
- Aumenta o acoplamento entre serviços e handlers
- Menor aderência a arquiteturas modulares ou DDD

## Observações

Se você não usar Scope.REQUEST:

- O UnitOfWork vira um singleton (compartilhado).
- Todos os handlers da aplicação (de diferentes requisições) compartilham o mesmo QueryRunner, o que pode gerar conflitos e bugs de transação, especialmente quando há concorrência.
