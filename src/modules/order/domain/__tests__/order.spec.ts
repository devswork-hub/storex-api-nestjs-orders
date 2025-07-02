import {
  Currency,
  CurrencyEnum,
} from '../../../../shared/domain/value-objects/currency.vo';
import { Money } from '../../../../shared/domain/value-objects/money.vo';
import { OrderModel } from '../order';
import { OrderItemModel } from '../order-item';

describe('OrderModel', () => {
  it('return OrderModel', () => {
    const order = OrderModel.create({
      status: 'PENDING',
      items: [
        new OrderItemModel({
          productId: 'product-1',
          quantity: 1,
          price: new Money(100, new Currency(CurrencyEnum.BRL)),
        }),
        new OrderItemModel({
          productId: 'product-1',
          quantity: 1,
          price: new Money(100, new Currency(CurrencyEnum.BRL)),
        }),
      ],
      discount: {
        couponCode: 'TEST',
        type: 'fixed',
        value: 40,
        currency: new Currency(CurrencyEnum.BRL),
      },
      currency: new Currency(CurrencyEnum.BRL),
      paymentSnapshot: {
        method: null,
        status: '',
        amount: 0,
        transactionId: '',
        installments: [],
      },
      shippingSnapshot: {
        shippingId: '',
        status: 'SHIPPED',
        carrier: '',
        service: '',
        fee: 0,
        deliveryDate: '',
        recipient: '',
      },
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
      customerId: '',
      paymentId: '',
    });
  });
});
