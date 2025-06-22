import {
  OrderModel,
  OrderModelContract,
} from '@/src/modules/order/domain/order';
import { Currency } from '@/src/shared/domain/value-objects/currency.vo';
import { Money } from '@/src/shared/domain/value-objects/money.vo';

export class OrderMongoMapper {
  static fromPersistence(raw: any): OrderModel {
    return OrderModel.create({
      ...raw,
      items: raw.items.map((item) => ({
        ...item,
        price: new Money(
          item.price.amount,
          new Currency(item.price.currency.code),
        ),
      })),
    });
  }

  static toPersistence(order: OrderModelContract): any {
    return {
      ...order,
      _id: order.id,
      currency: order.currency.code,
      subTotal: order.subTotal.amount,
      total: order.total.amount,
      items: order.items.map((i) => ({
        ...i,
        price: new Money(i.price.amount, new Currency(i.price.currency.code)),
      })),
      discount: order.discount
        ? {
            ...order.discount,
            currency: order.discount.currency.code,
          }
        : undefined,
    };
  }

  static toDomain(raw: any): OrderModelContract {
    return OrderModel.create({
      ...raw,
      id: raw._id,
      currency: new Currency(raw.currency),
      items: raw.items.map((i) => ({
        ...i,
        price: new Money(i.price.amount, new Currency(i.price.currency)),
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
