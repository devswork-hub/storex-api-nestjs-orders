import { MESSAGE_PATTERNS } from '@/modules/order/application/messaging/message-patterns';
import { OrderCreatedEvent } from '@/modules/order/domain/events/order-created.event';

export const EVENTS_MESSAGE_BROKER_CONFIG = {
  [OrderCreatedEvent.name]: {
    exchange: 'orders-topic-exchange',
    routingKey: MESSAGE_PATTERNS.ORDER_CREATED,
  },
};
