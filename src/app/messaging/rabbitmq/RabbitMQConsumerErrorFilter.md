# RabbitMQConsumerErrorFilter — Guia Completo

Este `.md` explica detalhadamente **o que seu código faz**, **por que ele existe** e **como usá‑lo / customizá‑lo** em um projeto NestJS que consome mensagens do RabbitMQ via [`@golevelup/nestjs-rabbitmq`].

> **Objetivo:** centralizar o tratamento de erros de consumidores (handlers) RMQ e decidir, de forma segura e previsível, **quando reprocessar** uma mensagem (com _delay_) e **quando rejeitá‑la** (enviando à DLQ ou descartando, dependendo da configuração da fila).

---

## Visão geral

A classe `RabbitMQConsumerErrorFilter` é um **Exception Filter** do NestJS que:

1. **Intercepta exceções** lançadas por consumidores RMQ.
2. **Classifica** o erro entre:
   - **Não reprocessável** (ex.: validações do domínio/entrada); ou
   - **Potencialmente transitório** (ex.: timeouts, indisponibilidade de dependências).
3. **Decide a ação**:
   - **Não reprocessável → `Nack(false)`**: rejeita **sem requeue** (vai para **DLQ** ou é descartada, conforme a política da fila).
   - **Reprocessável → reenvio com atraso**: republica a mensagem com um cabeçalho de contagem de tentativas e **`x-delay`** (backoff simples).
4. **Evita loops infinitos**: respeita um **limite máximo de tentativas**.

---

## Principais componentes do código

### 1) Metadados e dependências

- `@Catch()` — filtra **todas** as exceções, mas o próprio filtro faz _guard_ para atuar somente em **contexto RMQ**:
  ```ts
  if (host.getType<'rmq'>() !== 'rmq') return;
  ```
- `AmqpConnection` — usado para **republicar** a mensagem (retry com delay).
- `Nack` — sinaliza ao _broker_ que a mensagem foi **rejeitada**, sem requeue, entregando à **DLQ** (se configurada).

### 2) Políticas de reprocessamento

- `RETRY_COUNT_HEADER = 'x-retry-count'`  
  Nome do header usado para **contabilizar tentativas**.
- `MAX_RETRIES = 10`  
  Máximo de reprocessamentos antes de desistir.
- `NON_RETRYABLE_ERRORS = [ValidationException, BadRequestException, UnprocessableEntityException]`  
  **Erros definitivos** (problema com dados do domínio/entrada). **Nunca reprocessar**.

### 3) Fluxo no `catch`

1. **Contexto**: ignora se não for RMQ.
2. **Classificação**: se a exceção é uma das `NON_RETRYABLE_ERRORS` → **`Nack(false)`** imediato.
3. **Caso contrário**, obtém a mensagem (`ConsumeMessage`) e avalia `shouldRetry(headers)`:
   - **`true`** → chama `retry(message)` e **republica** com:
     - incremento de `x-retry-count`;
     - `headers['x-delay'] = 5000` (delay de 5s);
     - mesmo `routingKey` original;
     - preserva `correlationId`.
   - **`false`** → **`Nack(false)`** (sem requeue).

### 4) Decisão `shouldRetry`

```ts
return (
  !(retryCountHeader in messageHeaders) ||
  parseInt(messageHeaders[retryCountHeader] as string, 10) < maxRetries
);
```

- **Primeira vez** (sem header) → reprocessa.
- **Até `MAX_RETRIES - 1`** → reprocessa.
- **A partir de `MAX_RETRIES`** → **não reprocessa**.

### 5) Reenvio com atraso (`retry`)

- Incrementa o contador `x-retry-count`.
- Define `x-delay = 5000` ms.
- Publica em `exchange = 'direct.delayed'` usando a **mesma routing key** da mensagem original.

> **Observação importante:** Para `x-delay` funcionar, é comum usar o **plugin** `rabbitmq_delayed_message_exchange` e configurar o _exchange_ do tipo `x-delayed-message` (ou usar infraestrutura equivalente que trate `x-delay`). Garanta isso na sua stack.

---

## Tabela de decisão (resumo)

| Situação do erro                                    | `shouldRetry` | Ação          | Efeito no broker                       |
| --------------------------------------------------- | ------------: | ------------- | -------------------------------------- |
| `NON_RETRYABLE_ERRORS` (ex.: `ValidationException`) |             – | `Nack(false)` | **Rejeita sem requeue** → DLQ/descarta |
| Erro transitório & `x-retry-count` < `MAX_RETRIES`  |        `true` | `retry()`     | **República** com `x-delay` (backoff)  |
| Erro transitório & `x-retry-count` ≥ `MAX_RETRIES`  |       `false` | `Nack(false)` | **Rejeita sem requeue**                |

---

## Como usar no NestJS

### Em um handler específico

```ts
import { UseFilters } from '@nestjs/common';

@UseFilters(RabbitMQConsumerErrorFilter)
@RabbitSubscribe({ exchange: '...', routingKey: '...', queue: '...' })
async handle(msg: SeuPayload) {
  // ... sua lógica (lançar exceções conforme necessário)
}
```

> Se preferir **globalmente**, registre como `APP_FILTER` com **injeção do `AmqpConnection`** via provider (ex.: usando `useFactory`). Evite instanciar manualmente para não quebrar DI.

---

## Requisitos de infraestrutura

1. **Exchange de retry com delay**  
   Um _exchange_ compatível com `x-delay` (ex.: `x-delayed-message`) e nome **`direct.delayed`** (como usado no código) — ou ajuste no método `retry`.
2. **DLQ configurada**  
   As filas devem ter **dead-letter-exchange**/**dead-letter-routing-key** para que mensagens `nack(false)` sejam encami\-nhadas corretamente.
3. **Idempotência**  
   Reprocessamentos exigem **handlers idempotentes** para evitar efeitos colaterais repetidos.

---

## Boas práticas & extensões

- **Backoff exponencial**  
  Em vez de `x-delay = 5000` fixo, calcule com base em `retryCount`:
  ```ts
  const base = 5000;
  headers['x-delay'] = Math.min(5 * 60_000, base * 2 ** (retryCount - 1));
  ```
- **Normalizar o tipo do header**  
  Garanta que `x-retry-count` seja sempre **número** (e não string) ao ler/escrever.
- **Aprimoramento no incremento**  
  No seu código atual:
  ```ts
  headers[retryCountHeader] = headers[retryCountHeader] || retryCount;
  ```
  Isso **não sobrescreve** em tentativas subsequentes. Prefira:
  ```ts
  headers[retryCountHeader] = retryCount; // sempre atualiza
  ```
- **Observabilidade**  
  Inclua `logger` com `correlationId`, `routingKey`, contagem e motivo do erro.
- **Whitelist/Blacklist de erros**  
  Ajuste `NON_RETRYABLE_ERRORS` para seu domínio (ex.: `NotFoundException` definitivamente não reprocessável).
- **Circuit breaker**  
  Combine com _circuit breaker_ se a dependência externa estiver instável.

---

## Exemplo de configuração de fila (referência)

```jsonc
{
  "queue": "minha.fila",
  "arguments": {
    "x-dead-letter-exchange": "dlx.exchange",
    "x-dead-letter-routing-key": "minha.fila.dlq",
  },
}
```

E um _exchange_ de delay (nome deve bater com o usado no `publish`):

```jsonc
{
  "exchange": "direct.delayed",
  "type": "x-delayed-message",
  "arguments": { "x-delayed-type": "direct" },
}
```

---

## Por que isso é útil?

- **Robustez**: separa erros definitivos de condições transitórias.
- **Controle**: limita tentativas, evita _poison messages_ em loop.
- **Elasticidade**: _backoff_ alivia pressão sobre serviços instáveis.
- **Simplicidade**: política centralizada, reproduzível e testável.

---

## Pontos de atenção (edge cases)

- **Tipos de headers**: amqplib pode trafegar strings ou números — normalize.
- **Mensagens grandes**: republicação copia `message.content`; atenção a payloads volumosos.
- **Compatibilidade**: confirme a existência do plugin/infra para `x-delay`.
- **Segurança**: preserve/propague `correlationId` como já feito, e valide inputs.

---

## TL;DR

Este filtro **decide automaticamente** o destino de mensagens que falham:

- **Erros não reprocessáveis** → **DLQ** (via `Nack(false)`).
- **Erros transitórios** → **retry com atraso** até **`MAX_RETRIES`**, mantendo `correlationId` e `routingKey`.

Ajuste **header**, **limite**, **lista de erros** e **estratégia de delay** conforme suas necessidades.
