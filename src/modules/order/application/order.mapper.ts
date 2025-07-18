import {
  OrderModel,
  OrderModelContract,
  OrderModelInput,
} from '../domain/order';
import { OrderItemModelContract } from '../domain/order-item';
import { OrderOuput } from './graphql/outputs/order.output';
import { DiscountOutput } from './graphql/outputs/discount.output';
import { PaymentOutput } from './graphql/outputs/payment.output';
import { ShippingOutput } from './graphql/outputs/shipping.output';
import { BillingAddressOutput } from './graphql/outputs/billing-address.output';
import { OrderItemOutput } from './graphql/outputs/order-item.output';
import { CreateOrderGraphQLInput } from './graphql/inputs/order.inputs';
import {
  Currency,
  CurrencyEnum,
} from '@/src/shared/domain/value-objects/currency.vo';
import { Money } from '@/src/shared/domain/value-objects/money.vo';
import {
  OrderStatus,
  PaymentMethodEnum,
  ShippingStatus,
} from '../domain/order.constants';

export class OrderMapper {
  static toDomainInput(input: CreateOrderGraphQLInput): OrderModelInput {
    return {
      status: input.status as OrderStatus,
      currency: new Currency(input.currency as CurrencyEnum),
      items: input.items.map(
        (item): OrderItemModelContract => ({
          ...item,
          price: new Money(
            item.price.amount,
            new Currency(item.price.currency as CurrencyEnum),
          ),
          ...(item.discount && {
            discount: {
              couponCode: item.discount.couponCode,
              value: item.discount.value,
              type: item.discount.type,
              currency: new Currency(item.discount.currency as CurrencyEnum),
            },
          }),
        }),
      ),
      discount: input.discount
        ? {
            couponCode: input.discount.couponCode,
            value: input.discount.value,
            type: input.discount.type,
            currency: new Currency(input.discount.currency as CurrencyEnum),
          }
        : undefined,
      paymentSnapshot: {
        ...input.paymentSnapshot,
        method: input.paymentSnapshot.method as PaymentMethodEnum,
      },
      shippingSnapshot: {
        ...input.shippingSnapshot,
        status: input.shippingSnapshot.status as ShippingStatus,
      },
      billingAddress: input.billingAddress,
      customerId: input.customerId,
      paymentId: input.paymentId,
      notes: input.notes,
    };
  }

  static fromEntitytoGraphQLOrderOutput(data: OrderModelContract): OrderOuput {
    const order = OrderModel.create(data);
    return {
      id: order.id,
      status: order.status,
      customerId: order.customerId,
      paymentId: order.paymentId,
      notes: order.notes,
      currency: order.currency.code,
      subTotal: order.subTotal.amount,
      total: order.total.amount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      active: order.active,
      deleted: order.deleted,
      deletedAt: order.deletedAt,
      items: order.items.map((item) => OrderMapper.toOrderItemOutput(item)),
      discount: OrderMapper.mapDiscount(order.discount),
      paymentSnapshot: OrderMapper.mapPayment(order.paymentSnapshot),
      shippingSnapshot: OrderMapper.mapShipping(order.shippingSnapshot),
      billingAddress: OrderMapper.mapBillingAddress(order.billingAddress),
    };
  }

  // Aqui precisa ser static também
  static toOrderItemOutput(item: OrderItemModelContract): OrderItemOutput {
    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: {
        amount: item.price.amount,
        currency: item.price.currency.code,
      },
      discount: item.discount ? this.mapDiscount(item.discount) : undefined,
      seller: item.seller,
      title: item.title,
      imageUrl: item.imageUrl,
      description: item.description,
      shippingId: item.shippingId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }

  // Esses métodos privados também, pois são chamados com this.
  static mapDiscount(
    discount?: OrderModelContract['discount'],
  ): DiscountOutput | undefined {
    if (!discount) return undefined;
    return {
      value: discount.value,
      type: discount.type,
      couponCode: discount.couponCode,
      currency: discount.currency.code,
    };
  }

  static mapPayment(
    payment: OrderModelContract['paymentSnapshot'],
  ): PaymentOutput {
    return {
      method: payment.method,
      status: payment.status,
      amount: payment.amount,
      transactionId: payment.transactionId,
    };
  }

  static mapShipping(
    snapshot: OrderModelContract['shippingSnapshot'],
  ): ShippingOutput {
    return {
      ...snapshot,
    };
  }

  static mapBillingAddress(
    address: OrderModelContract['billingAddress'],
  ): BillingAddressOutput {
    return {
      ...address,
    };
  }
}
