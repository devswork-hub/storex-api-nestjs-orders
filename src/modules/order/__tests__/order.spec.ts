import {
  Currency,
  CurrencyEnum,
} from '../../../shared/domain/value-objects/currency.vo';
import { OrderModel } from '../order';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { OrderItem } from '../order-item';

describe('OrderModel', () => {
  it('return OrderModel', () => {
    const order = OrderModel.create({
      status: 'PENDING',
      items: [
        new OrderItem({
          productId: 'product-1',
          quantity: 1,
          price: new Money(100, new Currency(CurrencyEnum.BRL)),
        }),
        new OrderItem({
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
        method: 'credit_card',
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
    // console.log(order.subTotal);
    // console.log(order.total);
    // console.log(JSON.stringify(order, null, 2));
  });
});
