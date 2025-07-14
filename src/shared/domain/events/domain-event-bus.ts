import { DomainEventType } from './domain-event';

type DomainEventHandlerType<T extends DomainEventType> = {
  handle(event: T): Promise<void> | void;
};

export class DomainEventBus {
  private handlers: Map<string, Set<DomainEventHandlerType<any>>> = new Map();
  private eventHistory: DomainEventType[] = [];

  subscribe<T extends DomainEventType>(
    eventType: string,
    handler: DomainEventHandlerType<T>,
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler);
    console.log(`✅ Handler subscribed to ${eventType}`);
  }

  unsubscribe<T extends DomainEventType>(
    eventType: string,
    handler: DomainEventHandlerType<T>,
  ): void {
    const eventHandlers = this.handlers.get(eventType);
    if (eventHandlers) {
      eventHandlers.delete(handler);
      if (eventHandlers.size === 0) {
        this.handlers.delete(eventType);
      }
    }
  }

  async publish<T extends DomainEventType>(event: T): Promise<void> {
    this.eventHistory.push(event);

    const eventHandlers = this.handlers.get(event.eventType);

    if (!eventHandlers || eventHandlers.size === 0) {
      console.log(`⚠️  No handlers found for event ${event.eventType}`);
      return;
    }

    console.log(`📢 Publishing domain event: ${event.eventType}`);

    const handlerPromises = Array.from(eventHandlers).map(async (handler) => {
      try {
        await handler.handle(event);
      } catch (error) {
        console.error(`❌ Error handling event ${event.eventType}:`, error);
      }
    });

    await Promise.all(handlerPromises);
  }

  async publishAll(events: DomainEventType[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  getEventHistory(): DomainEventType[] {
    return [...this.eventHistory];
  }

  getSubscribersCount(eventType: string): number {
    return this.handlers.get(eventType)?.size || 0;
  }

  clearHistory(): void {
    this.eventHistory = [];
  }
}
