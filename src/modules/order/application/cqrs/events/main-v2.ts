// /*
//   Estrutura de exemplo para integrar EventBus interno com RabbitMQ e in-memory
// */

// // file: src/event-bus/in-memory-event-bus.ts
// export type EventHandler = (event: any) => Promise<void> | void;

// export class InMemoryEventBus {
//   private listeners = new Map<string, EventHandler[]>();

//   publish(event: any) {
//     const name = event.constructor.name;
//     const handlers = this.listeners.get(name) || [];
//     for (const h of handlers) {
//       Promise.resolve(h(event));
//     }
//   }

//   subscribe(eventName: string, handler: EventHandler) {
//     if (!this.listeners.has(eventName)) {
//       this.listeners.set(eventName, []);
//     }
//     this.listeners.get(eventName)!.push(handler);
//   }
// }

// // file: src/rabbitmq/rabbit-publisher.service.ts
// import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
// import * as amqplib from 'amqplib';

// @Injectable()
// export class RabbitPublisherService implements OnModuleInit, OnModuleDestroy {
//   private connection!: amqplib.Connection;
//   private channel!: amqplib.Channel;
//   private readonly exchange = 'orders';

//   async onModuleInit() {
//     this.connection = await amqplib.connect(
//       process.env.RABBIT_URL || 'amqp://localhost',
//     );
//     this.channel = await this.connection.createChannel();
//     await this.channel.assertExchange(this.exchange, 'topic', {
//       durable: true,
//     });
//   }

//   async publish(routingKey: string, message: any) {
//     const buffer = Buffer.from(JSON.stringify(message));
//     this.channel.publish(this.exchange, routingKey, buffer, {
//       persistent: true,
//     });
//   }

//   async onModuleDestroy() {
//     await this.channel.close();
//     await this.connection.close();
//   }
// }

// // file: src/events/order-created.event.ts
// export class OrderCreatedEvent {
//   constructor(
//     public readonly orderId: string,
//     public readonly payload: any,
//   ) {}
// }

// // file: src/handlers/order-created-publisher.handler.ts
// import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
// import { OrderCreatedEvent } from '../events/order-created.event';
// import { RabbitPublisherService } from '../rabbitmq/rabbit-publisher.service';

// @EventsHandler(OrderCreatedEvent)
// export class OrderCreatedPublisherHandler
//   implements IEventHandler<OrderCreatedEvent>
// {
//   constructor(private readonly rabbit: RabbitPublisherService) {}

//   async handle(event: OrderCreatedEvent) {
//     // Log interno ou outros handlers podem existir
//     console.log('Evento local recebido:', event);

//     // Publica no RabbitMQ
//     await this.rabbit.publish('order.created', event);
//   }
// }

// // file: src/usecases/create-order.usecase.ts
// import { Injectable } from '@nestjs/common';
// import { InMemoryEventBus } from '../event-bus/in-memory-event-bus';
// import { OrderCreatedEvent } from '../events/order-created.event';
// import { OrderInMemoryRepository } from '../repositories/order-in-memory.repository';

// @Injectable()
// export class CreateOrderUseCase {
//   constructor(
//     private readonly repo: OrderInMemoryRepository,
//     private readonly bus: InMemoryEventBus,
//   ) {}

//   async execute(input: any) {
//     const order = await this.repo.createOne(input);
//     this.bus.publish(new OrderCreatedEvent(order.id, input));
//     return order;
//   }
// }

// // file: src/app.module.ts
// import { Module } from '@nestjs/common';
// import { CqrsModule } from '@nestjs/cqrs';
// import { InMemoryEventBus } from './event-bus/in-memory-event-bus';
// import { RabbitPublisherService } from './rabbitmq/rabbit-publisher.service';
// import { OrderCreatedPublisherHandler } from './handlers/order-created-publisher.handler';
// import { CreateOrderUseCase } from './usecases/create-order.usecase';
// import { OrderInMemoryRepository } from './repositories/order-in-memory.repository';

// @Module({
//   imports: [CqrsModule],
//   providers: [
//     InMemoryEventBus,
//     RabbitPublisherService,
//     CreateOrderUseCase,
//     OrderInMemoryRepository,
//     OrderCreatedPublisherHandler,
//   ],
// })
// export class AppModule {}

// // file: src/repositories/order-in-memory.repository.ts
// import { InMemoryBaseRepository } from '../shared/in-memory-base.repository';
// import { OrderModelContract } from '../domain/order';

// export class OrderInMemoryRepository extends InMemoryBaseRepository<OrderModelContract> {
//   // métodos específicos se necessário
// }

// // file: src/main.ts
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { InMemoryEventBus } from './event-bus/in-memory-event-bus';
// import { OrderCreatedPublisherHandler } from './handlers/order-created-publisher.handler';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Opcional: Associa handlers no event bus manualmente
//   const bus = app.get(InMemoryEventBus);
//   const publisher = app.get(OrderCreatedPublisherHandler);
//   bus.subscribe('OrderCreatedEvent', (event) => publisher.handle(event));

//   await app.listen(3000);
// }
// bootstrap();

// @EventsHandler(OrderCreatedEvent)
// export class PublishToRabbitHandler
//   implements IEventHandler<OrderCreatedEvent>
// {
//   handle(event: OrderCreatedEvent) {
//     this.rabbitService.publish('order.created', event);
//   }
// }

// await this.eventBus.publish(new OrderCreatedEvent(order.id)); // só o handler que envia pro Rabbit
