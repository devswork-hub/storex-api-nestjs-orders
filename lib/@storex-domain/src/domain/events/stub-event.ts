import { fakeId } from '../../testing/fake-id';
import { StubType } from '../../testing/stub';
import { UUID } from '../value-objects/uuid.vo';
import { DomainEventType } from './domain-event';

type StubEventProps = {
  eventType: string;
  aggregateId: string;
};

export class StubEvent implements DomainEventType {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  readonly payload: StubType;

  constructor(props?: Partial<StubEventProps>) {
    this.eventId = fakeId || new UUID().toString();
    this.eventType = 'StubEvent';
    this.aggregateId = props.aggregateId || new UUID().toString();
    this.occurredOn = new Date();
  }

  static create(props?: Partial<StubEventProps>) {
    return new StubEvent(props);
  }
}
