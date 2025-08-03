import { DomainEventType } from '@/src/shared/domain/events/domain-event';
import { MessageBrokerContract } from './message-broker.contract';

type HandlerType = Record<string, (event: DomainEventType) => Promise<void>>;

export class InMemoryBroker implements MessageBrokerContract {
  private handlers: HandlerType = {};

  async publish(event: DomainEventType) {
    const handler = this.handlers[event.eventType];
    if (handler) handler(event);
  }

  subscribe<T extends DomainEventType>(
    event: { new (...args: any[]): T },
    handler: (event: T) => Promise<void>,
  ): void {
    this.handlers[event.name] = handler;
  }

  unsubscribe<T extends DomainEventType>(event: {
    new (...args: any[]): T;
  }): void {
    delete this.handlers[event.name];
  }
}
