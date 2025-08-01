// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as amqplib from 'amqplib';

// @Injectable()
// export class RabbitMQSetupService implements OnModuleInit {
//   constructor(private readonly config: ConfigService) {}

//   async onModuleInit() {
//     const connection = await amqplib.connect(this.config.get('RABBITMQ_URL'));
//     const channel = await connection.createChannel();

//     await channel.assertExchange('orders-topic-exchange', 'topic', {
//       durable: true,
//     });

//     await channel.assertQueue('orders_queue', {
//       durable: true, // ou false, contanto que seja consistente com o restante
//     });

//     // 🔽 Aqui você escuta mensagens como "order.created", "order.updated", etc.
//     await channel.bindQueue('orders_queue', 'orders-topic-exchange', 'order.*');
//     // 🔽 Aqui você escuta mensagens como "order.payment.success", "order.cancel.email", etc.
//     await channel.bindQueue('orders_queue', 'orders-topic-exchange', 'order.#');

//     await channel.close();
//     await connection.close();
//   }
// }

import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitMQSetupService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const connection = await amqplib.connect(this.config.get('RABBITMQ_URL'));
    const channel = await connection.createChannel();

    const exchange = 'orders-topic-exchange';

    // Declara o exchange do tipo topic
    await channel.assertExchange(exchange, 'topic', { durable: true });

    // 📩 Fila de e-mails
    await channel.assertQueue('orders_queue', { durable: true });
    await channel.bindQueue('orders_queue', exchange, 'order.created');

    await channel.assertQueue('email-queue', { durable: true });
    await channel.bindQueue('email-queue', exchange, 'order.created');

    await channel.close();
    await connection.close();
  }
}
