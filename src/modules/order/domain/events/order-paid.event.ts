import { DomainEventType } from '@/src/shared/domain/events/domain-event';
import { UUID } from '@/src/shared/domain/value-objects/uuid.vo';

type OrderPaidPayload = {
  id: string;
  paymentId: string;
  paymentStatus: string;
  amount: number;
};

export class OrderPaidEvent implements DomainEventType {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: OrderPaidPayload;

  constructor(payload: OrderPaidPayload) {
    this.eventId = new UUID().toString();
    this.eventType = OrderPaidEvent.name;
    this.aggregateId = payload.id;
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
