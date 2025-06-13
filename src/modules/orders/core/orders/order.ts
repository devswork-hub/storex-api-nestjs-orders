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
  currency: Currency;
  paymentSnapshot: PaymentSnapshot;
  shippingSnapshot: ShippingSnapshot;
  billingAddress: BillingAddress;
  customerId: string;
  paymentId: string;
  notes?: string;
  discount?: Discount;

  constructor(
    status: OrderStatus,
    items: OrderItem[],
    currency: Currency,
    paymentSnapshot: PaymentSnapshot,
    shippingSnapshot: ShippingSnapshot,
    billingAddress: BillingAddress,
    customerId: string,
    paymentId: string,
    notes?: string,
    discount?: Discount,
  ) {
    this.status = status;
    this.items = items;
    this.currency = currency;
    this.paymentSnapshot = paymentSnapshot;
    this.shippingSnapshot = shippingSnapshot;
    this.billingAddress = billingAddress;
    this.customerId = customerId;
    this.paymentId = paymentId;
    this.notes = notes;
    this.discount = discount || undefined; // Optional discount
  }

  get subTotal(): number {
    return this.items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  set subTotal(value: number) {
    this.subTotal = value;
  }

  get discountAmount(): number {
    if (!this.discount) return 0;
    if (this.discount.type === 'fixed') return this.discount.value;
    if (this.discount.type === 'percentage')
      return this.subTotal * (this.discount.value / 100);
    return 0;
  }

  get shippingTotal(): number {
    return this.shippingSnapshot?.fee || 0;
  }

  get total(): number {
    const total = this.subTotal - this.discountAmount + this.shippingTotal;
    return Math.max(0, total);
  }
}
