// import { Controller, Inject } from '@nestjs/common';
// import {
//   ClientProxy,
//   Ctx,
//   MessagePattern,
//   Payload,
//   RmqContext,
// } from '@nestjs/microservices';
// import { RMQ_ORDERS_SERVICE } from './rabbitmq.module';

// @Controller()
// export class RabbitConsumer {
//   constructor(@Inject(RMQ_ORDERS_SERVICE) private userClient: ClientProxy) {}

//   @MessagePattern({ cmd: 'order.created' })
//   async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
//     const channel = context.getChannelRef();
//     const message = context.getMessage();

//     try {
//       console.log('Order received:', data);

//       channel.ack(message);
//     } catch (err) {
//       console.error('Error processing order', err);

//       // Estratégia simples de reprocessamento
//       const retries = message.properties.headers['x-retries'] || 0;
//       if (retries < 3) {
//         message.properties.headers['x-retries'] = retries + 1;
//         channel.nack(message, false, true); // requeue
//       } else {
//         channel.nack(message, false, false); // dead-letter
//       }
//     }
//   }

//   @MessagePattern({ cmd: 'user.registered' })
//   handleUserRegistered(@Payload() data: any) {
//     /* … */
//   }
// }

// // // rabbitmq.consumer.ts
// // import { Injectable, OnModuleInit } from '@nestjs/common';
// // import { RabbitMQConfigService } from './rabbitmq.config.service';

// // @Injectable()
// // export class RabbitMQConsumer implements OnModuleInit {
// //   constructor(private readonly rabbitConfig: RabbitMQConfigService) {}

// //   async onModuleInit() {
// //     const channel = await this.rabbitConfig.getChannel();

// //     await channel.addSetup(async (ch) => {
// //       await ch.consume('order_created_queue', (msg) => {
// //         if (msg !== null) {
// //           const data = JSON.parse(msg.content.toString());
// //           console.log('🟢 Mensagem recebida:', data);

// //           ch.ack(msg); // ack manual
// //         }
// //       });
// //     });
// //   }
// // }
