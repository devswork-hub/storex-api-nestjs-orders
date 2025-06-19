import { Currency } from '@/src/shared/domain/value-objects/currency.vo';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'AWAITING_SHIPMENT'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export enum OrderStatusEnum {
  PENDING = 'PENDING',
  PAID = 'PAID',
  AWAITING_SHIPMENT = 'AWAITING_SHIPMENT',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export type BillingAddress = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type Discount = {
  couponCode: string;
  value: number;
  type: 'percentage' | 'fixed';
  currency: Currency;
};

export enum DiscountTypeEnum {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum PaymentMethodEnum {
  CREDIT_CARD = 'credit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
}

export type PaymentSnapshot = {
  method: PaymentMethodEnum;
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

export type ShippingSnapshot = {
  shippingId?: string; // ID externo do frete na API de envio
  status: ShippingStatus;
  carrier: string; // Exemplo: "Correios"
  service: string; // Exemplo: "PAC"
  fee?: number; // Taxa de entrega (ex: R$ 0,00)
  deliveryDate?: string; // Exemplo: "Entregue no dia 7 de junho"
  recipient?: string; // Exemplo: "Entregue nas mãos de um morador"
};

export type ShippingStatus =
  | 'NOT_REQUESTED'
  | 'REQUESTED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'FAILED';
