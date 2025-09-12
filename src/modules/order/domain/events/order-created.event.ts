import { DomainEventType } from '@/shared/domain/events/domain-event';
import { OrderModelContract } from '../order';
import { UUID } from '@/shared/domain/value-objects/uuid.vo';

export class OrderCreatedEvent implements DomainEventType {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: OrderModelContract;

  constructor(payload: OrderModelContract) {
    this.eventId = new UUID().toString();
    this.eventType = OrderCreatedEvent.name;
    this.aggregateId = payload.id;
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
