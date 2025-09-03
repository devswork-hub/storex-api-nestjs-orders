import { fakeId } from '@/shared/testing/fake-id';
import { OrderCreatedEvent } from '../../events/order-created.event';
import { orderTestData } from '../../order-test-builder';

describe('OrderCreatedEvent', () => {
  it('should create an instance of OrderCreatedEvent', () => {
    const event = new OrderCreatedEvent(orderTestData);

    expect(event).toBeInstanceOf(OrderCreatedEvent);
    expect(event.payload.id).toBe(fakeId);
  });

  it('should have correct event properties', () => {
    const event = new OrderCreatedEvent(orderTestData);

    expect(event.eventType).toBe('OrderCreatedEvent');
    expect(event.aggregateId).toBe(orderTestData.id);
    expect(event.occurredOn).toBeInstanceOf(Date);
    expect(event.eventId).toBeDefined();
  });

  it('should correctly assign the payload', () => {
    const event = new OrderCreatedEvent(orderTestData);

    expect(event.payload).toEqual(orderTestData);
  });
});
