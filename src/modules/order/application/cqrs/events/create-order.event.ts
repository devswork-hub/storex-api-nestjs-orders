// // import { EventsHandler } from '@nestjs/cqrs';

// // @EventsHandler(OrderCreatedEvent)
// // export class PublishOrderCreatedToRabbitMQ {
// //   constructor(private readonly rabbitMQClient: RabbitMQClient) {}

// //   async handle(event: OrderCreatedEvent) {
// //     await this.rabbitMQClient.publish('order.created', event);
// //   }
// // }
// export class OrderCreatedEvent {
//   constructor(
//     public readonly orderId: string,
//     public readonly data: any,
//   ) {}
// }

// import { Injectable } from '@nestjs/common';
// // handlers/publish-order-created.handler.ts
// import { EventBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import * as amqplib from 'amqplib';

// @EventsHandler(OrderCreatedEvent)
// export class PublishOrderCreatedHandler
//   implements IEventHandler<OrderCreatedEvent>
// {
//   private channel: amqplib.Channel;

//   constructor() {
//     this.connect();
//   }

//   async connect() {
//     const connection = await amqplib.connect('amqp://localhost');
//     this.channel = await connection.createChannel();
//     await this.channel.assertExchange('orders', 'topic', { durable: true });
//   }

//   async handle(event: OrderCreatedEvent) {
//     const message = JSON.stringify(event.data);
//     this.channel.publish('orders', 'order.created', Buffer.from(message), {
//       persistent: true,
//     });
//     console.log(`Mensagem publicada no RabbitMQ: ${message}`);
//   }
// }

// @Injectable()
// export class OrderService {
//   constructor(private readonly eventBus: EventBus) {}

//   async createOrder(data: any) {
//     // lógica para criar o pedido (salvar no banco, etc)
//     const orderId = '123'; // só um exemplo

//     // emite o evento internamente
//     this.eventBus.publish(new OrderCreatedEvent(orderId, data));

//     return { orderId };
//   }
// }
