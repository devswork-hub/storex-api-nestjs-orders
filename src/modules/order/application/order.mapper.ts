import { OrderModelContract } from '../order';
import { OrderItemContract } from '../order-item';
import { OrderOuput } from './graphql/order.output';
import { DiscountOutput } from './graphql/outputs/discount.output';
import { PaymentOutput } from './graphql/outputs/payment.output';
import { ShippingOutput } from './graphql/outputs/shipping.output';
import { BillingAddressOutput } from './graphql/outputs/billing-address.output';
import { OrderItemOutput } from './graphql/order-item.output';

export class OrderMapper {
  static fromEntitytoGraphQLOrderOutput(order: OrderModelContract): OrderOuput {
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
      items: order.items.map((item) => this.toOrderItemOutput(item)),
      discount: this.mapDiscount(order.discount),
      paymentSnapshot: this.mapPayment(order.paymentSnapshot),
      shippingSnapshot: this.mapShipping(order.shippingSnapshot),
      billingAddress: this.mapBillingAddress(order.billingAddress),
    };
  }

  private static toOrderItemOutput(item: OrderItemContract): OrderItemOutput {
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

  private static mapDiscount(
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

  private static mapPayment(
    payment: OrderModelContract['paymentSnapshot'],
  ): PaymentOutput {
    return {
      method: payment.method,
      status: payment.status,
      amount: payment.amount,
      transactionId: payment.transactionId,
    };
  }

  private static mapShipping(
    snapshot: OrderModelContract['shippingSnapshot'],
  ): ShippingOutput {
    return {
      ...snapshot,
    };
  }

  private static mapBillingAddress(
    address: OrderModelContract['billingAddress'],
  ): BillingAddressOutput {
    return {
      ...address,
    };
  }
}
