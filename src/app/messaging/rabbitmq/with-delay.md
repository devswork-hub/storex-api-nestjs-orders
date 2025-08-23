# ADR 001 – Uso de `withDelay` e Retry com Backoff em Mensagens RabbitMQ

**Status:** Aceito  
**Data:** 22/08/2025  
**Contexto:**  
No sistema de pedidos da aplicação, mensagens críticas como **OrderReminderEvent** precisam ser processadas com atraso (delay) e reprocessadas em caso de falha. Atualmente, utilizamos o parâmetro `withDelay` do `@golevelup/nestjs-rabbitmq` para atrasar a entrega inicial da mensagem. Além disso, implementamos um filtro de erros (`RabbitMQConsumerErrorFilter`) para retry em caso de falha.

Observamos que o delay definido via `withDelay` é **aplicado apenas na primeira entrega**. Quando a mensagem falha e é reprocessada pelo filtro de erros, o delay é definido manualmente, ignorando o delay original.

---

## Decisão

1. **Separar delay inicial do retry**

   - `withDelay` será usado apenas para a **primeira entrega**, definindo o comportamento do negócio (ex: 10s após criação do pedido).
   - Retries usarão **delay próprio**, calculado de forma exponencial (backoff) para evitar sobrecarga do sistema em caso de falhas temporárias.

2. **Implementação de backoff exponencial nos retries**

   - Delay do retry será calculado como:
     ```
     retryDelay = originalDelay * 2^(retryCount - 1)
     ```
   - Exemplo: originalDelay = 10s → retries: 10s, 20s, 40s.

3. **Armazenar delay original nos headers da mensagem**

   - Delay inicial será salvo em `x-original-delay` nos headers da mensagem.
   - Permite calcular backoff consistente nos retries.

4. **Retries limitados e DLX**

   - Máximo de retries configurado (`MAX_RETRIES = 3`).
   - Erros não retryable (ex.: `ValidationException`, `BadRequestException`) vão direto para DLX.
   - Mensagens que atingem o limite de retries também vão para DLX.

5. **Fila específica por tipo de evento**

   - Cada tipo de evento crítico terá sua própria fila delayed, ex.: `order-reminder-delayed-queue`.
   - Facilita monitoramento, escalabilidade e aplicação de políticas específicas de TTL e retry.

6. **Logs detalhados para debug**
   - Logs incluem: exchange, routingKey, retryCount, delay original, delay aplicado, headers e conteúdo da mensagem.

---

## Consequências

- O delay do negócio (`withDelay`) é mantido para a primeira entrega.
- Retries não sobrescrevem o delay original, mas aplicam backoff exponencial, protegendo o sistema de sobrecarga.
- Facilita debug e monitoramento de mensagens atrasadas ou em retry.
- Maior controle sobre filas específicas, evitando interferência entre diferentes tipos de eventos.
