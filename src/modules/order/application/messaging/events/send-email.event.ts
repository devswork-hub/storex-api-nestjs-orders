import { DomainEventType } from '@/src/shared/domain/events/domain-event';
import { UUID } from '@/src/shared/domain/value-objects/uuid.vo';

type EventPayload = {
  to: string;
  subject: string;
  body: string;
};

export class SendEmailEvent implements DomainEventType {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: EventPayload;

  constructor(payload: EventPayload) {
    this.eventId = new UUID().toString();
    this.eventType = SendEmailEvent.name;
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
