import { RabbitMQPublisherService } from '@/src/app/shared/messaging/rabbitmq.publisher';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCreatedEvent } from '../../../domain/events/order-created.event';

// // events/order-created.event.ts
// export class OrderCreatedEvent {
//   constructor(
//     public readonly orderId: string,
//     public readonly items: any[],
//   ) {}
// }

// events/order-completed.event.ts
export class OrderCompletedEvent {
  constructor(public readonly orderId: string) {}
}

// handlers/order-created.handler.ts
// Nao vai funcionar porque o evento OrderCreatedEvent não ta sendo publicado no CreateOrderTransactionCommand
// @EventsHandler(OrderCreatedEvent)
// export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
//   async handle(event: OrderCreatedEvent) {
//     console.log('passei aqui?');
//     console.log('Order Created Event:', event);
//   }
// }

// handlers/order-updated.handler.ts
@EventsHandler(OrderCompletedEvent)
export class OrderCompletedHandler
  implements IEventHandler<OrderCompletedEvent>
{
  constructor(private readonly publisher: RabbitMQPublisherService) {}

  async handle(event: OrderCompletedEvent) {
    // console.log('Order Updated Event:', event);
    // Publicar no RabbitMQ
    await this.publisher.publish('order.created', {
      orderId: event.orderId,
      data: event,
    });
    // Handle the event (e.g., update read models)
  }
}
