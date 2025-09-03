import { TestDataBuilder } from '@/shared/testing/test-data-builder';
import { OrderModelContract } from './order';
import { faker } from '@faker-js/faker';
import {
  Currency,
  CurrencyEnum,
} from '@/shared/domain/value-objects/currency.vo';
import { fakeId } from '@/shared/testing/fake-id';

export class OrderTestBuilder extends TestDataBuilder<OrderModelContract> {}

export const orderTestData = new OrderTestBuilder()
  .with('id', fakeId)
  .with('customerId', fakeId)
  .with('discount', {
    couponCode: 'BRL30',
    currency: new Currency(CurrencyEnum.BRL),
    type: 'percentage',
    value: 150,
  })
  .with('currency', new Currency(CurrencyEnum.BRL))
  .with('active', true)
  .with('billingAddress', {
    city: faker.location.city.toString(),
    state: faker.location.state.toString(),
    street: faker.location.street.toString(),
    zipCode: faker.location.zipCode.toString(),
  })
  .build();
