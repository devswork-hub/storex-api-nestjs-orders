// import { Injectable, OnModuleInit } from '@nestjs/common';
// import * as amqp from 'amqp-connection-manager';

// @Injectable()
// export class RabbitMQConfigService implements OnModuleInit {
//   private connection = amqp.connect(['amqp://guest:guest@localhost:5672']);
//   private channelWrapper = this.connection.createChannel({
//     json: true,
//   });

//   async onModuleInit() {
//     const exchange = 'orders_exchange';
//     const queue = 'order_created_queue';
//     const routingKey = 'order.created';

//     await this.channelWrapper.addSetup(async (channel) => {
//       await channel.assertExchange(exchange, 'direct', { durable: true });
//       await channel.assertQueue(queue, { durable: true });
//       await channel.bindQueue(queue, exchange, routingKey);
//     });

//     console.log('RabbitMQ exchange, queue e binding configurados.');
//   }

//   getChannel() {
//     return this.channelWrapper;
//   }
// }
