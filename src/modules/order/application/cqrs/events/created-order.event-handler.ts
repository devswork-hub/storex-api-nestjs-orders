import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly data: any,
  ) {}
}

@EventsHandler(OrderCreatedEvent)
export class CreatedOrderEventHandler
  implements IEventHandler<OrderCreatedEvent>
{
  async handle(event: OrderCreatedEvent) {
    console.log('[Domain Event] User created: ', event);
  }
}
