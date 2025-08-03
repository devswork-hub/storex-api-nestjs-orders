import { OrderModel, OrderModelContract } from '@/modules/order/domain/order';
import {
  Currency,
  CurrencyEnum,
} from '@/shared/domain/value-objects/currency.vo';
import { Money } from '@/shared/domain/value-objects/money.vo';
import {
  OrderMongoEntity,
  OrderMongoEntityProps,
} from './documents/order.document';
import {
  DiscountTypeEnum,
  OrderStatus,
  PaymentStatusEnum,
} from '../../domain/order.constants';
import { DateUtils } from '@/shared/domain/date';

export type OrderMongoProps = Omit<OrderMongoEntity, keyof Document>;

export class OrderMongoMapper {
  static toPersistence(order: OrderModelContract): OrderMongoProps {
    return {
      _id: order.id,
      status: order.status,
      active: order.active,
      deleted: order.deleted,
      deletedAt: order.deletedAt
        ? DateUtils.getDate(order.deletedAt)
        : undefined,

      createdAt: order.createdAt
        ? DateUtils.getDate(order.createdAt)
        : undefined,
      updatedAt: order.updatedAt
        ? DateUtils.getDate(order.updatedAt)
        : undefined,
      customerId: order.customerId,
      paymentId: order.paymentId,
      notes: order.notes,
      currency: order.currency.code,
      billingAddress: order.billingAddress,
      shippingSnapshot: order.shippingSnapshot,
      paymentSnapshot: {
        ...order.paymentSnapshot,
        status: order.paymentSnapshot.status as PaymentStatusEnum,
      },
      items: order.items.map((i) => ({
        _id: i.id,
        active: i.active,
        deleted: i.deleted,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        productId: i.productId,
        quantity: i.quantity,
        price: {
          amount: i.price.amount,
          currency: i.price.currency.code,
        },
        seller: i.seller,
        title: i.title,
        imageUrl: i.imageUrl,
        description: i.description,
        shippingId: i.shippingId,
      })),
      discount: order.discount
        ? {
            ...order.discount,
            currency: order.discount.currency.code,
          }
        : undefined,
    };
  }

  static fromPersistence(raw: OrderMongoEntityProps): OrderModelContract {
    return OrderModel.create({
      id: raw._id,
      status: raw.status as OrderStatus,
      active: raw.active,
      deleted: raw.deleted,
      deletedAt: raw.deletedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      customerId: raw.customerId,
      paymentId: raw.paymentId,
      notes: raw.notes,
      currency: new Currency(raw.currency as CurrencyEnum),
      billingAddress: raw.billingAddress,
      shippingSnapshot: raw.shippingSnapshot,
      paymentSnapshot: raw.paymentSnapshot,
      items: raw.items.map((item: any) => ({
        id: item._id,
        active: item.active,
        deleted: item.deleted,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        productId: item.productId,
        quantity: item.quantity,
        price: new Money(item.price.amount, new Currency(item.price.currency)),
        seller: item.seller,
        title: item.title,
        imageUrl: item.imageUrl,
        description: item.description,
        shippingId: item.shippingId,
      })),
      discount: raw.discount
        ? {
            ...raw.discount,
            type: raw.discount.type as DiscountTypeEnum,
            currency: new Currency(raw.discount.currency as CurrencyEnum),
          }
        : undefined,
    });
  }

  static toDomain(raw: any): OrderModelContract {
    return OrderModel.create({
      id: raw._id,
      status: raw.status,
      active: raw.active,
      deleted: raw.deleted,
      deletedAt: raw.deletedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      customerId: raw.customerId,
      paymentId: raw.paymentId,
      notes: raw.notes,
      currency: new Currency(raw.currency.code as CurrencyEnum),
      billingAddress: raw.billingAddress,
      shippingSnapshot: raw.shippingSnapshot,
      paymentSnapshot: raw.paymentSnapshot,
      items: raw.items.map((i: any) => ({
        id: i._id,
        active: i.active,
        deleted: i.deleted,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        productId: i.productId,
        quantity: i.quantity,
        price: new Money(
          i.price.amount,
          new Currency(i.price.currency.code as CurrencyEnum),
        ),
        seller: i.seller,
        title: i.title,
        imageUrl: i.imageUrl,
        description: i.description,
        shippingId: i.shippingId,
      })),
      discount: raw.discount
        ? {
            ...raw.discount,
            currency: new Currency(raw.discount.currency),
          }
        : undefined,
    });
  }
}
