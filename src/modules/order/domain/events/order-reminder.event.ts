import { DomainEventType } from '@/shared/domain/events/domain-event';
import { UUID } from '@/shared/domain/value-objects/uuid.vo';

type OrderReminderPayload = {
  orderId: string;
  customerId: string;
  email: string;
};

export class OrderReminderEvent implements DomainEventType {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: OrderReminderPayload;

  constructor(payload: OrderReminderPayload) {
    this.eventId = new UUID().toString();
    this.eventType = OrderReminderEvent.name;
    this.aggregateId = payload.orderId;
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
