# Tratamento de Mensagens com RabbitMQ (`Nack` e `Ack`)

Quando trabalhamos com consumidores no **RabbitMQ**, é fundamental entender o que acontece quando aceitamos (`Ack`) ou rejeitamos (`Nack`) uma mensagem. Isso define se a mensagem será processada novamente, descartada ou enviada para uma **DLQ (Dead Letter Queue)**.

---

## 🔹 `Ack` (Acknowledgement)

- Confirma que a mensagem foi **processada com sucesso**.
- A mensagem é **removida da fila**.
- Exemplo:
  ```ts
  channel.ack(message);
  ```

---

## 🔹 `Nack` (Negative Acknowledgement)

O `Nack` informa ao RabbitMQ que a mensagem **não pôde ser processada**.

### Sintaxe

```ts
channel.nack(message, multiple, requeue);
```

Ou, no `@golevelup/nestjs-rabbitmq`:

```ts
throw new Nack(requeue?: boolean);
```

### Parâmetros

- **`multiple`** (quando usamos `channel.nack` diretamente)

  - `true` → aplica o `nack` a **essa e todas as anteriores** não confirmadas.
  - `false` → aplica somente a esta mensagem.

- **`requeue`**
  - `true` → devolve a mensagem para a fila (tentará novamente).
  - `false` → não devolve. Vai para a **DLQ** (se existir) ou é **descartada**.

---

## 🔹 Diferença entre `Nack(true)` e `Nack(false)`

| Situação      | Ação        | Consequência                                              |
| ------------- | ----------- | --------------------------------------------------------- |
| `Nack(true)`  | Requeue     | Mensagem volta para a fila e será processada de novo.     |
| `Nack(false)` | Não requeue | Mensagem vai para a DLQ (se configurada) ou é descartada. |

---

## 🔹 Quando usar cada um?

### ✅ `Nack(false)` → erros **não processáveis**

- Mensagem inválida (ex.: payload com formato errado).
- Dados que não existem no sistema (ex.: cliente inexistente).
- Versão da mensagem não suportada.

> Reprocessar não resolve → **descartar ou enviar para DLQ**.

---

### ✅ `Nack(true)` → erros **temporários**

- Timeout no banco de dados.
- Serviço externo indisponível.
- Falha de rede.

> Reprocessar pode resolver → **reenfileirar**.

---

## 🔹 Resumo do fluxo

1. **`Ack`** → Processado com sucesso → removido da fila.
2. **`Nack(true)`** → Erro temporário → volta para a fila.
3. **`Nack(false)`** → Erro permanente → vai para DLQ ou descartado.

---

## 🔹 Boas práticas

- Sempre configurar **DLQ** para não perder mensagens importantes.
- Usar `Nack(false)` para **erros permanentes**.
- Usar `Nack(true)` apenas quando há chance real de sucesso em nova tentativa.
- Centralizar a lógica em um **ExceptionFilter**, evitando duplicação em cada handler.

---

✍️ Esse guia serve como referência para lidar com `Ack` e `Nack` no RabbitMQ, especialmente ao usar `@golevelup/nestjs-rabbitmq`.
