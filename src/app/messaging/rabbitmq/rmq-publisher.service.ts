import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerContract } from './message-broker.contract';
import { DomainEventType } from '@/shared/domain/events/domain-event';
import { EVENTS_MESSAGE_BROKER_CONFIG } from './events-message-broker.config';

interface PublishOptions {
  headers?: Record<string, any>; // Para x-delay ou outros headers
  exchange?: string; // Permite sobrescrever a exchange do config
  routingKey?: string; // Permite sobrescrever o routingKey do config
  withDelay?: {
    delay: number; // Tempo de atraso em milissegundos
  };
}

@Injectable()
export class RmqPublisherService implements MessageBrokerContract {
  private logger = new Logger(RmqPublisherService.name);

  constructor(private readonly amqp: AmqpConnection) {}

  async publish(
    event: DomainEventType,
    customOptions?: PublishOptions,
  ): Promise<void> {
    const config = EVENTS_MESSAGE_BROKER_CONFIG[event.eventType];

    if (!config) {
      throw new Error(
        `Configuration not found for event type: ${event.eventType}`,
      );
    }

    const exchange = customOptions?.exchange || config.exchange;
    const routingKey = customOptions?.routingKey || config.routingKey;

    this.logger.debug(`Sending event from type ${event.eventType}`);

    await this.amqp.publish(exchange, routingKey, event, {
      headers: {
        ...(customOptions?.headers || {}),
        ...(customOptions?.withDelay
          ? { 'x-delay': customOptions.withDelay.delay }
          : {}),
      },
    });
  }
}
