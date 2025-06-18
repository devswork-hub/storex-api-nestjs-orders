import { OrderItem, OrderItemContract } from './order-item';
import { Currency } from '../../shared/domain/value-objects/currency.vo';
import {
  BillingAddress,
  Discount,
  OrderStatus,
  PaymentSnapshot,
  ShippingSnapshot,
} from './order.constants';
import { BaseModel, BaseModelProps } from '../../shared/domain/base/model.base';
import { Money } from '../../shared/domain/value-objects/money.vo';
import { calculateDiscountAmount } from './utils/discount-calculator';
import { OrderID } from './order-id';

export type OrderModelInput = Omit<OrderModelContract, 'subTotal' | 'total'>;

export type OrderModelContract = {
  status: OrderStatus;
  items: OrderItemContract[];
  subTotal: Money;
  total: Money;
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

  constructor(props: OrderModelInput) {
    const id = OrderID.generate(OrderID).getValue();
    super({ ...props, id });
    // Desestruturação ignorando `subTotal` e `total`
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
    // if (!this.discount) return new Money(0, this.currency);
    // if (this.discount.type === 'fixed') {
    //   if (
    //     this.discount.currency &&
    //     this.discount.currency.code !== this.currency.code
    //   ) {
    //     throw new Error('Desconto em moeda diferente do pedido');
    //   }
    //   return new Money(this.discount.value, this.currency);
    // }
    // if (this.discount.type === 'percentage')
    //   return new Money(
    //     this.subTotal.amount * (this.discount.value / 100),
    //     this.currency,
    //   );
    // return new Money(0, this.currency);
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
      console.log(item.price.currency.code, this.currency.code);
      return item.price.currency.code !== this.currency.code;
    });

    if (hasInvalidCurrency) {
      throw new Error('Order items must have the same currency as the order');
    }
  }

  static create(props: OrderModelInput): OrderModel {
    return new OrderModel({
      ...props,
      items: props.items.map((item) => new OrderItem(item)),
    });
  }
}
