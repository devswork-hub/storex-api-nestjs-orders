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
  // Converte do domínio para o Mongo (persistência)
  static toPersistence(order: OrderModelContract): OrderMongoProps {
    return {
      _id: order.id,
      status: order.status, // salvo como string
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
      currency: order.currency.code, // salvo como string
      billingAddress: order.billingAddress,
      shippingSnapshot: order.shippingSnapshot,
      customerSnapshot: order.customerSnapshot,
      paymentSnapshot: {
        ...order.paymentSnapshot,
        status: order.paymentSnapshot.status as PaymentStatusEnum,
      },
      items:
        order.items.map((i) => ({
          _id: i.id,
          active: i.active,
          deleted: i.deleted,
          createdAt: i.createdAt,
          updatedAt: i.updatedAt,
          productId: i.productId,
          quantity: i.quantity,
          price: {
            amount: i.price.amount,
            currency: i.price.currency.code, // string
          },
          seller: i.seller,
          title: i.title,
          imageUrl: i.imageUrl,
          description: i.description,
          shippingId: i.shippingId,
        })) || [],
      discount: order.discount
        ? {
            ...order.discount,
            currency: order.discount.currency.code, // string
          }
        : undefined,
    };
  }

  // Converte do Mongo para o domínio
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
      customerSnapshot: raw.customerSnapshot,
      items: (raw.items ?? []).map((i: any) => ({
        id: i._id ?? i.id,
        active: i.active,
        deleted: i.deleted,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        productId: i.productId,
        quantity: i.quantity,
        price: new Money(
          i.price.amount,
          typeof i.price.currency === 'string'
            ? new Currency(i.price.currency as CurrencyEnum)
            : new Currency(i.price.currency.code as CurrencyEnum),
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
            type: raw.discount.type as DiscountTypeEnum,
            currency: new Currency(raw.discount.currency as CurrencyEnum),
          }
        : undefined,
    });
  }

  // Mapper genérico para reconstruir domínio a partir de qualquer "raw" (ex.: payload do evento)
  static toDomain(raw: any): OrderModelContract {
    return OrderModel.create({
      id: raw._id ?? raw.id,
      status: raw.status as OrderStatus,
      active: raw.active,
      deleted: raw.deleted,
      deletedAt: raw.deletedAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      customerId: raw.customerId,
      paymentId: raw.paymentId,
      notes: raw.notes,
      currency: new Currency(
        typeof raw.currency === 'string'
          ? (raw.currency as CurrencyEnum)
          : raw.currency.code,
      ),
      billingAddress: raw.billingAddress,
      shippingSnapshot: raw.shippingSnapshot,
      paymentSnapshot: raw.paymentSnapshot,
      customerSnapshot: raw.customerSnapshot,
      items: (raw.items ?? []).map((i: any) => ({
        id: i._id ?? i.id,
        active: i.active,
        deleted: i.deleted,
        createdAt: i.createdAt,
        updatedAt: i.updatedAt,
        productId: i.productId,
        quantity: i.quantity,
        price: new Money(
          i.price.amount,
          typeof i.price.currency === 'string'
            ? new Currency(i.price.currency as CurrencyEnum)
            : new Currency(i.price.currency.code as CurrencyEnum),
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
            type: raw.discount.type as DiscountTypeEnum,
            currency:
              typeof raw.discount.currency === 'string'
                ? new Currency(raw.discount.currency as CurrencyEnum)
                : new Currency(raw.discount.currency.code as CurrencyEnum),
          }
        : undefined,
    });
  }
}
