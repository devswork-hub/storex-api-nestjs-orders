import { OrderStatus } from './value-objects/order-status';
import { PaymentSnapshot } from './contracts/payment-snapshot';
import { ShippingSnapshot } from './contracts/shipping-snapshot';
import { OrderItem } from './order-item';
import { Currency } from './value-objects/currency';

export class Order {
  status: OrderStatus;
  items: OrderItem[];

  // Resumo financeiro
  subTotal: number;

  // total: number;
  currency: Currency;

  // Snapshot da informação de pagamento no momento da criação do pedido
  paymentSnapshot: PaymentSnapshot;

  // Snapshot da informação de entrega no momento da criação do pedido
  shippingSnapshot: ShippingSnapshot;

  // Endereço de cobrança
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };

  // Referências externas
  customerId: string; // ID do cliente na API de clientes
  paymentId: string; // ID do pagamento na API de pagamentos

  // Atributos opcionais
  notes?: string; // Observações feitas pelo cliente
  discount?: {
    couponCode: string;
    value: number;
    type: 'percentage' | 'fixed';
  };

  get total() {
    let calculatedTotal = this.subTotal;

    if (this.discount) {
      if (this.discount.type === 'fixed') {
        calculatedTotal -= this.discount.value;
      } else if (this.discount.type === 'percentage') {
        calculatedTotal -= calculatedTotal * (this.discount.value / 100);
      }
    }

    // Garante que o total não seja negativo
    return Math.max(0, calculatedTotal);
  }
}
