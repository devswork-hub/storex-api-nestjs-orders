// domain-event.ts
import { DomainEventType } from '@/shared/domain/events/domain-event';
import { UUID } from '@/shared/domain/value-objects/uuid.vo';

export abstract class DomainEvent<T> implements DomainEventType {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: T;

  constructor(eventType: string, aggregateId: string, payload: T) {
    this.eventId = new UUID().toString();
    this.eventType = eventType;
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
