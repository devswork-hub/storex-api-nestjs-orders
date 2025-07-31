import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqplib from 'amqplib';

@Injectable()
export class RabbitMQSetupService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}

  async onModuleInit() {
    const connection = await amqplib.connect(this.config.get('RABBITMQ_URL'));
    const channel = await connection.createChannel();

    // Criação de exchange (tipo direct, topic, etc)
    await channel.assertExchange('orders-exchange', 'direct', {
      durable: true,
    });

    // Criação de fila
    await channel.assertQueue('orders_queue', {
      durable: true,
    });

    // Binding: exchange → fila com routing key
    await channel.bindQueue('orders_queue', 'orders-exchange', 'order.created');

    await channel.close();
    await connection.close();
  }
}
