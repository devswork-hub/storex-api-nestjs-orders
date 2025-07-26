import { DomainEventType } from '../../../../shared/domain/events/domain-event';
import { UUID } from '../../../../shared/domain/value-objects/uuid.vo';
import { OrderModelContract } from '../order';

export class OrderCreatedEvent implements DomainEventType {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  // TODO: validar se é util ou nao
  readonly eventVersion?: string;
  readonly payload: OrderModelContract;

  constructor(payload: OrderModelContract) {
    this.eventId = new UUID().toString();
    this.eventType = OrderCreatedEvent.name;
    this.aggregateId = payload.id;
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
