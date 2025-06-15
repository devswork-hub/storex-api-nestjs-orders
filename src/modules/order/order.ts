import { BaseModel, BaseModelProps } from 'src/shared/domain/base/model.base';
import { OrderItem } from './order-item';
import { Currency } from '@/src/shared/domain/value-objects/currency.vo';
import {
  BillingAddress,
  Discount,
  OrderStatus,
  PaymentSnapshot,
  ShippingSnapshot,
} from './order.constants';

export type OrderModelContract = {
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
} & BaseModelProps;

export class OrderModel extends BaseModel implements OrderModelContract {
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

  constructor(props: OrderModelContract) {
    super(props);
    Object.assign(this, props);
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

  static create(props: OrderModelContract): OrderModel {
    return new OrderModel(props);
  }
}
