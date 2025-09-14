import { TestDataBuilder } from '@/shared/testing/test-data-builder';
import { OrderModelContract } from './order';
import { faker } from '@faker-js/faker';
import {
  Currency,
  CurrencyEnum,
} from '@/shared/domain/value-objects/currency.vo';
import { fakeId } from '@/shared/testing/fake-id';

export class OrderTestBuilder extends TestDataBuilder<OrderModelContract> {
  protected defaults: Partial<OrderModelContract> = {
    id: fakeId,
    customerId: fakeId,
    currency: new Currency(CurrencyEnum.BRL),
    active: true,
    customerSnapshot: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
    },
    billingAddress: {
      city: faker.location.city(),
      state: faker.location.state(),
      street: faker.location.street(),
      zipCode: faker.location.zipCode(),
    },
  };

  static withDiscount(): OrderModelContract {
    return new OrderTestBuilder()
      .with('discount', {
        couponCode: 'BRL30',
        currency: new Currency(CurrencyEnum.BRL),
        type: 'percentage',
        value: 150,
      })
      .build();
  }

  static withPayment(): OrderModelContract {
    return new OrderTestBuilder().with('paymentId', fakeId).build();
  }

  static paidOrder(): OrderModelContract {
    return new OrderTestBuilder().with('status', 'PAID' as any).build();
  }
}
