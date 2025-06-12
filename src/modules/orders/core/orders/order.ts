import { OrderStatus } from './value-objects/order-status';
import { PaymentSnapshot } from './contracts/payment-snapshot';
import { ShippingSnapshot } from './contracts/shipping-snapshot';
import { OrderItem } from './order-item';
import { Currency } from './value-objects/currency';
import { BillingAddress } from './contracts/billing-address';
import { Discount } from './contracts/discount';

export type OrderContract = {
  status: OrderStatus;
  items: OrderItem[];
  subTotal: number;
  total: number;
  currency: Currency;
  paymentSnapshot: PaymentSnapshot; // Snapshot da informação de pagamento no momento da criação do pedido
  shippingSnapshot: ShippingSnapshot; // Snapshot da informação de entrega no momento da criação do pedido
  billingAddress: BillingAddress; // Endereço de cobrança
  customerId: string; // ID do cliente na API de clientes
  paymentId: string; // ID do pagamento na API de pagamentos
  notes?: string; // Observações feitas pelo cliente
  discount?: Discount; // Desconto aplicado ao pedido
};

export class Order implements OrderContract {
  status: OrderStatus;
  items: OrderItem[];
  subTotal: number;
  currency: Currency;
  paymentSnapshot: PaymentSnapshot;
  shippingSnapshot: ShippingSnapshot;
  billingAddress: BillingAddress;
  customerId: string;
  paymentId: string;
  notes?: string;
  discount?: Discount;

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
