// import { Injectable, OnModuleInit } from '@nestjs/common';
// // import { RabbitMQConfigService } from '../rabbitmq.config.service';

// @Injectable()
// export class OrderListenerService implements OnModuleInit {
//   // constructor(private readonly rabbitMQ: RabbitMQConfigService) {}

//   async onModuleInit() {
//     const channel = await this.rabbitMQ.getChannel();

//     await channel.assertQueue('order.created', { durable: true });

//     channel.consume('order.created', async (msg) => {
//       if (!msg) return;

//       try {
//         const content = JSON.parse(msg.content.toString());
//         console.log('[ORDER CREATED]', content);

//         // process your message
//         // e.g., await this.orderService.handleOrderCreated(content);

//         channel.ack(msg);
//       } catch (err) {
//         console.error('Error processing order.created message:', err);
//         channel.nack(msg, false, false); // optional: send to DLQ
//       }
//     });
//   }
// }
