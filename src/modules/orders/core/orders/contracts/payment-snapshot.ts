export type PaymentSnapshot = {
  method: 'credit_card' | 'boleto' | 'pix' | 'bank_transfer';
  status: 'paid' | 'pending' | 'failed' | string; // Status da transação no momento
  amount: number; // Valor total do pagamento
  transactionId?: string; // ID da transação no provedor de pagamento
  installments?: Array<{
    number: number; // Número de parcelas
    value: number; // Valor de cada parcela
    interestRate?: number; // Taxa de juros, se houver
    totalValue?: number; // Valor total com juros
    dueDate?: string; // Data de vencimento da parcela
  }>;
};
