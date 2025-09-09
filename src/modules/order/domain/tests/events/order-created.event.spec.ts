import { fakeId } from '@/shared/testing/fake-id';
import { OrderCreatedEvent } from '../../events/order-created.event';
import { orderTestData } from '../../order-test-builder';
import { TestAdapter } from '@/shared/testing/test-adapter';

describe('OrderCreatedEvent', () => {
  it('should create an instance of OrderCreatedEvent', () => {
    const event = new OrderCreatedEvent(orderTestData);

    TestAdapter.expect(event).toBeInstanceOf(OrderCreatedEvent);
    TestAdapter.expect(event.payload.id).toBe(fakeId);
  });

  it('should have correct event properties', () => {
    const event = new OrderCreatedEvent(orderTestData);

    TestAdapter.expect(event.eventType).toBe('OrderCreatedEvent');
    TestAdapter.expect(event.aggregateId).toBe(orderTestData.id);
    TestAdapter.expect(event.occurredOn).toBeInstanceOf(Date);
    TestAdapter.expect(event.eventId).toBeDefined();
  });

  it('should correctly assign the payload', () => {
    const event = new OrderCreatedEvent(orderTestData);

    TestAdapter.expect(event.payload).toEqual(orderTestData);
  });
});
