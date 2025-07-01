import {
  OrderModel,
  OrderModelContract,
} from '../../../modules/order/domain/order';
import { SearchableHandler } from './searchable.handler';
import { Currency, CurrencyEnum } from '../../domain/value-objects/currency.vo';

describe('SearchableHandler', () => {
  it('Test handler', async () => {
    const handler = new SearchableHandler<OrderModelContract>([
      OrderModel.create({
        status: 'PENDING', // replace with appropriate OrderStatus value
        items: [], // replace with appropriate OrderItemModelContract[] if needed
        currency: new Currency(CurrencyEnum.BRL), // replace with appropriate Currency value
        paymentSnapshot: {} as any, // replace with a valid PaymentSnapshot object
        shippingSnapshot: {} as any, // replace with a valid ShippingSnapshot object
        createdAt: new Date(),
        updatedAt: new Date(),
        billingAddress: {} as any, // replace with a valid BillingAddress object
        customerId: 'customer-id', // replace with a valid customerId
        paymentId: 'payment-id', // replace with a valid paymentId
      }),
    ]);

    const result = await handler.handle({
      filter: { status: 'PENDING' },
      sort: { field: 'createdAt', direction: 'desc' },
      pagination: { type: 'offset', page: 1, limit: 20 },
    });

    console.log(result);
  });
});
