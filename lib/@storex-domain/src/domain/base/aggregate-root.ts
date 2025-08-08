import { DomainEventType } from '../events/domain-event';

export class AggregateRoot {
  events: Set<DomainEventType> = new Set<DomainEventType>();

  private domainEvents: DomainEventType[] = [];

  protected addDomainEvent(event: DomainEventType) {
    this.domainEvents.push(event);
  }

  public pullDomainEvents(): DomainEventType[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}
