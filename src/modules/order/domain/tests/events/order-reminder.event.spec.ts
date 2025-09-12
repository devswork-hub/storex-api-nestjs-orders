import { fakeId } from '@/shared/testing/fake-id';
import { TestAdapter } from '@/shared/testing/test-adapter';
import { OrderReminderEvent } from '../../events/order-reminder.event';

describe(OrderReminderEvent.name, () => {
  const event = new OrderReminderEvent({
    customerId: fakeId,
    email: 'email@email.com',
    orderId: fakeId,
  });

  it('should create an instance of OrderCreatedEvent', () => {
    TestAdapter.expect(event).toBeInstanceOf(OrderReminderEvent);
    TestAdapter.expect(event.payload.orderId).toBe(fakeId);
  });

  it('should have correct event properties', () => {
    TestAdapter.expect(event.eventType).toBe('OrderReminderEvent');
    TestAdapter.expect(event.aggregateId).toBe(event.payload.orderId);
    TestAdapter.expect(event.occurredOn).toBeInstanceOf(Date);
    TestAdapter.expect(event.eventId).toBeDefined();
  });
});
