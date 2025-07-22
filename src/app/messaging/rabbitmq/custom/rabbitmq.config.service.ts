import { Injectable, type OnModuleInit, Logger } from '@nestjs/common';
import * as amqp from 'amqp-connection-manager';
import type { ChannelWrapper } from 'amqp-connection-manager';
import type { ConfirmChannel } from 'amqplib';
import { ExchangeConfig } from './exchange-config.contract';
import { QueueConfig } from './queue.config.contract';

@Injectable()
export class RabbitMQConfigService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQConfigService.name);
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: ChannelWrapper;

  // Configurações enterprise dos exchanges
  private readonly exchanges: ExchangeConfig[] = [
    {
      name: 'orders.topic.exchange',
      type: 'topic',
      options: { durable: true, autoDelete: false },
    },
    {
      name: 'orders.direct.exchange',
      type: 'direct',
      options: { durable: true, autoDelete: false },
    },
    {
      name: 'orders.fanout.exchange',
      type: 'fanout',
      options: { durable: true, autoDelete: false },
    },
    {
      name: 'orders.dlx.exchange',
      type: 'direct',
      options: { durable: true, autoDelete: false },
    },
  ];

  // Configurações enterprise das filas
  private readonly queues: QueueConfig[] = [
    // High Priority Queues
    {
      name: 'order.payment.queue',
      exchange: 'orders.topic.exchange',
      routingKey: 'order.*.payment',
      options: {
        durable: true,
        arguments: {
          'x-message-ttl': 300000, // 5 minutes
          'x-dead-letter-exchange': 'orders.dlx.exchange',
          'x-dead-letter-routing-key': 'payment.dlq',
        },
      },
      dlq: true,
    },
    {
      name: 'order.inventory.queue',
      exchange: 'orders.topic.exchange',
      routingKey: 'order.*.inventory',
      options: {
        durable: true,
        arguments: {
          'x-message-ttl': 300000,
          'x-dead-letter-exchange': 'orders.dlx.exchange',
          'x-dead-letter-routing-key': 'inventory.dlq',
        },
      },
      dlq: true,
    },
    // Standard Priority Queues
    {
      name: 'order.notification.queue',
      exchange: 'orders.topic.exchange',
      routingKey: 'order.*.notification',
      options: {
        durable: true,
        arguments: {
          'x-message-ttl': 600000, // 10 minutes
          'x-dead-letter-exchange': 'orders.dlx.exchange',
          'x-dead-letter-routing-key': 'notification.dlq',
        },
      },
      dlq: true,
    },
    {
      name: 'order.analytics.queue',
      exchange: 'orders.fanout.exchange',
      routingKey: '',
      options: { durable: true },
    },
    // Dead Letter Queues
    {
      name: 'payment.dlq',
      exchange: 'orders.dlx.exchange',
      routingKey: 'payment.dlq',
      options: { durable: true },
    },
    {
      name: 'inventory.dlq',
      exchange: 'orders.dlx.exchange',
      routingKey: 'inventory.dlq',
      options: { durable: true },
    },
    {
      name: 'notification.dlq',
      exchange: 'orders.dlx.exchange',
      routingKey: 'notification.dlq',
      options: { durable: true },
    },
    // Retry Queues
    {
      name: 'payment.retry.queue',
      exchange: 'orders.direct.exchange',
      routingKey: 'payment.retry',
      options: {
        durable: true,
        arguments: {
          'x-message-ttl': 30000, // 30 seconds delay
          'x-dead-letter-exchange': 'orders.topic.exchange',
          'x-dead-letter-routing-key': 'order.retry.payment',
        },
      },
    },
  ];

  constructor() {
    this.connection = amqp.connect(['amqp://guest:guest@localhost:5672'], {
      reconnectTimeInSeconds: 5,
      heartbeatIntervalInSeconds: 5,
    });

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: this.setupInfrastructure.bind(this),
    });

    // Connection event handlers
    this.connection.on('connect', () => {
      this.logger.log('✅ Connected to RabbitMQ');
    });

    this.connection.on('disconnect', (err) => {
      this.logger.error('❌ Disconnected from RabbitMQ', err);
    });
  }

  async onModuleInit() {
    await this.channelWrapper.waitForConnect();
    this.logger.log('🚀 RabbitMQ infrastructure configured successfully');
  }
  private async setupInfrastructure(channel: ConfirmChannel) {
    // Setup exchanges
    for (const exchange of this.exchanges) {
      await channel.assertExchange(
        exchange.name,
        exchange.type,
        exchange.options,
      );
      this.logger.log(
        `📡 Exchange configured: ${exchange.name} (${exchange.type})`,
      );
    }

    // Setup queues and bindings
    for (const queue of this.queues) {
      await channel.assertQueue(queue.name, queue.options);
      await channel.bindQueue(queue.name, queue.exchange, queue.routingKey);
      this.logger.log(
        `📬 Queue configured: ${queue.name} -> ${queue.exchange}:${queue.routingKey}`,
      );
    }
  }

  getChannel(): ChannelWrapper {
    return this.channelWrapper;
  }

  async closeConnection(): Promise<void> {
    await this.connection.close();
  }
}
