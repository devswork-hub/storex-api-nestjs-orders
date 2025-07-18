import { OrderItemModel, OrderItemModelContract } from './order-item';
import { Currency } from '../../../shared/domain/value-objects/currency.vo';
import {
  BillingAddress,
  Discount,
  OrderStatus,
  OrderStatusEnum,
  PaymentSnapshot,
  ShippingSnapshot,
} from './order.constants';
import {
  BaseModel,
  BaseModelProps,
} from '../../../shared/domain/base/model.base';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { calculateDiscountAmount } from './utils/discount-calculator';
import { OrderID } from './order-id';
import { OrderCreatedEvent } from './events/order-created.event';
import { OrderPaidEvent } from './events/order-paid.event';

export type OrderModelInput = Omit<OrderModelContract, 'subTotal' | 'total'>;

export type OrderModelContract = {
  status: OrderStatus;
  items: OrderItemModelContract[];
  currency: Currency;
  paymentSnapshot: PaymentSnapshot; // Snapshot da informação de pagamento no momento da criação do pedido
  shippingSnapshot: ShippingSnapshot; // Snapshot da informação de entrega no momento da criação do pedido
  billingAddress: BillingAddress; // Endereço de cobrança
  customerId: string; // ID do cliente na API de clientes
  paymentId?: string | null; // ID do pagamento na API de pagamentos
  notes?: string; // Observações feitas pelo cliente
  discount?: Discount; // Desconto aplicado ao pedido
} & BaseModelProps;

export class OrderModel extends BaseModel implements OrderModelContract {
  status: OrderStatus;
  items: OrderItemModel[];
  currency: Currency;
  paymentSnapshot: PaymentSnapshot;
  shippingSnapshot: ShippingSnapshot;
  billingAddress: BillingAddress;
  customerId: string;
  paymentId: string;
  notes?: string;
  discount?: Discount;

  constructor(props: OrderModelInput) {
    const id = OrderID.generate(OrderID).getValue();
    super({ ...props, id });
    Object.assign(this, props);
    this.validateCurrencyEntry();
  }

  get subTotal(): Money {
    return this.items.reduce(
      (total, item) => total.add(item.getTotalWithDiscount()),
      new Money(0, this.currency),
    );
  }

  get discountAmount(): Money {
    const discountValue = calculateDiscountAmount(
      this.subTotal.amount,
      this.discount,
      this.currency,
    );
    return new Money(discountValue, this.currency);
  }

  get shippingTotal(): Money {
    return new Money(this.shippingSnapshot?.fee || 0, this.currency);
  }

  get total(): Money {
    const totalValue =
      this.subTotal.amount -
      this.discountAmount.amount +
      this.shippingTotal.amount;
    return new Money(Math.max(0, totalValue), this.currency);
  }

  private validateCurrencyEntry() {
    const hasInvalidCurrency = this.items.some((item) => {
      return item.price.currency.code !== this.currency.code;
    });

    if (hasInvalidCurrency) {
      throw new Error('Order items must have the same currency as the order');
    }
  }

  addItem(item: OrderItemModelContract): void {
    const newItem = new OrderItemModel(item);
    if (newItem.price.currency.code !== this.currency.code) {
      throw new Error('Item currency must match the order currency');
    }
    this.items.push(newItem);
  }

  markAsPaid(paymentId: string) {
    if (this.status !== OrderStatusEnum.PENDING) {
      throw new Error(
        `Cannot mark order as paid. Current status: ${this.status}`,
      );
    }
    this.status = OrderStatusEnum.PAID;
    this.addDomainEvent(
      new OrderPaidEvent({
        id: this.id,
        paymentId,
        paymentStatus: this.paymentSnapshot.status,
        amount: this.total.amount,
      }),
    );
  }

  static create(props: OrderModelInput): OrderModel {
    const order = new OrderModel({
      ...props,
      items: props.items.map((item) => new OrderItemModel(item)),
    });
    order.status = OrderStatusEnum.PENDING;
    order.addDomainEvent(
      new OrderCreatedEvent({
        id: order.id,
        customerId: order.customerId,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map((item) => item),
        currency: order.currency.code.toString(),
        billingAddress: order.billingAddress,
        paymentId: order.paymentId,
        totalAmount: order.total.amount,
        shippingAddress: order.shippingSnapshot,
      }),
    );
    return order;
  }
}
