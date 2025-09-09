import {
  Currency,
  CurrencyEnum,
} from '@/shared/domain/value-objects/currency.vo';
import { OrderModel } from './order';
import { Money } from '@/shared/domain/value-objects/money.vo';
import { PaymentMethodEnum } from './order.constants';

describe('Order', () => {
  it('should return a valid order aggregate', () => {
    console.log(
      OrderModel.create({
        status: 'PENDING',
        items: [
          {
            productId: 'sample-product-id',
            quantity: 1,
            price: new Money(100, new Currency(CurrencyEnum.BRL)),
          },
        ],
        currency: new Currency(CurrencyEnum.BRL),
        paymentSnapshot: {
          method: PaymentMethodEnum.CREDIT_CARD,
          status: '',
          amount: 0,
        },
        shippingSnapshot: {
          status: 'SHIPPED',
          carrier: '',
          service: '',
        },
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
        },
        customerId: '',
      }),
    );
  });
});
