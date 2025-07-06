import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

// events/order-created.event.ts
export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly items: any[],
  ) {}
}

// events/order-completed.event.ts
export class OrderCompletedEvent {
  constructor(public readonly orderId: string) {}
}

// handlers/order-created.handler.ts
@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  async handle(event: OrderCreatedEvent) {
    console.log('Order Created Event:', event);
  }
}

// handlers/order-updated.handler.ts
@EventsHandler(OrderCompletedEvent)
export class OrderCompletedHandler
  implements IEventHandler<OrderCompletedEvent>
{
  handle(event: OrderCompletedEvent) {
    console.log('Order Updated Event:', event);
    // Handle the event (e.g., update read models)
  }
}
