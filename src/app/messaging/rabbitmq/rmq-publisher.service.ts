import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessageBrokerContract } from './message-broker.contract';
import { DomainEventType } from '@/shared/domain/events/domain-event';
import { EVENTS_MESSAGE_BROKER_CONFIG } from './events-message-broker.config';

@Injectable()
export class RmqPublisherService implements MessageBrokerContract {
  constructor(private readonly amqp: AmqpConnection) {}

  async publish(event: DomainEventType): Promise<void> {
    const config = EVENTS_MESSAGE_BROKER_CONFIG[event.eventType];
    this.amqp.publish(config.exchange, config.routingKey, event);
  }
}
