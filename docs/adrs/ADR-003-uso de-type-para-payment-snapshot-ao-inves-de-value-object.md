# ADR 007 - Uso de Type para PaymentSnapshot ao invés de Value Object

## Status

Aceito

## Data

2025-07-19

## Contexto

Durante a modelagem da entidade `OrderModel`, surgiu a necessidade de armazenar um snapshot das informações de pagamento no momento da criação do pedido. Essas informações incluem o método de pagamento, status, valor total, identificador da transação, número de parcelas, entre outros.

A princípio, foi considerada a criação de um Value Object para representar `PaymentSnapshot`, encapsulando possíveis validações e comportamentos relacionados ao pagamento. No entanto, após análise do contexto de negócio e uso, foi identificado que:

- O `PaymentSnapshot` **não participa de decisões ou regras de negócio**;
- Ele serve apenas como **registro imutável (log) da situação do pagamento** no momento da criação do pedido;
- O snapshot **não é reutilizado** fora do escopo do pedido;
- **Nenhuma lógica de domínio** é aplicada a ele;
- Seu uso principal é **persistência e leitura**, não transformação ou validação.

## Decisão

Optou-se por manter `PaymentSnapshot` como um `type` TypeScript (tipo estruturado) ao invés de um objeto de valor (Value Object).

```ts
export type PaymentSnapshot = {
  method: PaymentMethodEnum;
  status: 'paid' | 'pending' | 'failed' | string;
  amount: number;
  transactionId?: string;
  installments?: Array<{
    number: number;
    value: number;
    interestRate?: number;
    totalValue?: number;
    dueDate?: string;
  }>;
};
```
