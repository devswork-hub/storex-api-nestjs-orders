import { Injectable, Logger } from '@nestjs/common';
import type { RabbitMQConfigService } from './rabbitmq.config.service';
import { v4 as uuidv4 } from 'uuid';

export interface MessageOptions {
  priority?: number;
  expiration?: string;
  persistent?: boolean;
  messageId?: string;
  correlationId?: string;
  replyTo?: string;
  headers?: Record<string, any>;
}

export interface PublishResult {
  success: boolean;
  messageId: string;
  error?: Error;
}

@Injectable()
export class RabbitMQPublisher {
  private readonly logger = new Logger(RabbitMQPublisher.name);

  constructor(private readonly rabbitConfig: RabbitMQConfigService) {}

  async publishToTopic<T>(
    routingKey: string,
    message: T,
    options: MessageOptions = {},
  ): Promise<PublishResult> {
    return this.publish('orders.topic.exchange', routingKey, message, options);
  }

  async publishToDirect<T>(
    routingKey: string,
    message: T,
    options: MessageOptions = {},
  ): Promise<PublishResult> {
    return this.publish('orders.direct.exchange', routingKey, message, options);
  }

  async publishToFanout<T>(
    message: T,
    options: MessageOptions = {},
  ): Promise<PublishResult> {
    return this.publish('orders.fanout.exchange', '', message, options);
  }

  private async publish<T>(
    exchange: string,
    routingKey: string,
    message: T,
    options: MessageOptions = {},
  ): Promise<PublishResult> {
    const messageId = options.messageId || uuidv4();
    const correlationId = options.correlationId || uuidv4();

    const publishOptions = {
      messageId,
      correlationId,
      timestamp: Date.now(),
      persistent: options.persistent ?? true,
      priority: options.priority ?? 0,
      expiration: options.expiration,
      replyTo: options.replyTo,
      headers: {
        ...options.headers,
        'x-published-at': new Date().toISOString(),
        'x-publisher': 'order-service',
        'x-version': '1.0.0',
      },
    };

    try {
      const channel = this.rabbitConfig.getChannel();

      // Publisher confirms - aguarda confirmação do broker
      const confirmed = await new Promise<boolean>((resolve, reject) => {
        channel.publish(
          exchange,
          routingKey,
          Buffer.from(JSON.stringify(message)),
          publishOptions,
          (err, ok) => {
            if (err) {
              reject(err);
            } else {
              resolve(!!ok);
            }
          },
        );
      });

      if (confirmed) {
        this.logger.log(
          `✅ Message published: ${messageId} to ${exchange}:${routingKey}`,
        );
        return { success: true, messageId };
      } else {
        throw new Error('Message not confirmed by broker');
      }
    } catch (error) {
      this.logger.error(`❌ Failed to publish message: ${messageId}`, error);
      return { success: false, messageId, error: error as Error };
    }
  }

  // Método específico para eventos de pedido
  async publishOrderEvent(
    event: 'created' | 'updated' | 'cancelled' | 'completed',
    orderId: string,
    data: any,
    priority: 'high' | 'standard' | 'low' = 'standard',
  ): Promise<PublishResult[]> {
    const results: PublishResult[] = [];
    const priorityMap = { high: 10, standard: 5, low: 1 };

    // Publica para diferentes serviços baseado no evento
    const routingKeys = this.getRoutingKeysForEvent(event);

    for (const routingKey of routingKeys) {
      const result = await this.publishToTopic(
        routingKey,
        {
          orderId,
          event,
          data,
          timestamp: new Date().toISOString(),
        },
        {
          priority: priorityMap[priority],
          correlationId: orderId,
          headers: {
            'x-event-type': event,
            'x-order-id': orderId,
            'x-priority': priority,
          },
        },
      );

      results.push(result);
    }

    // Para eventos críticos, também publica via fanout para analytics
    if (['created', 'completed', 'cancelled'].includes(event)) {
      const fanoutResult = await this.publishToFanout(
        {
          orderId,
          event,
          data,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'x-event-type': event,
            'x-order-id': orderId,
            'x-for-analytics': true,
          },
        },
      );

      results.push(fanoutResult);
    }

    return results;
  }

  private getRoutingKeysForEvent(event: string): string[] {
    const baseRoutingKeys = {
      created: [
        'order.created.payment',
        'order.created.inventory',
        'order.created.notification',
      ],
      updated: ['order.updated.inventory', 'order.updated.notification'],
      cancelled: [
        'order.cancelled.payment',
        'order.cancelled.inventory',
        'order.cancelled.notification',
      ],
      completed: ['order.completed.notification', 'order.completed.logistics'],
    };

    return baseRoutingKeys[event] || [];
  }
}
