import { MESSAGE_PATTERNS } from '@/modules/order/application/messaging/message-patterns';
import { OrderCreatedEvent } from '@/modules/order/domain/events/order-created.event';
import { OrderDeletedEvent } from '@/modules/order/domain/events/order-deleted.event';
import { OrderReminderEvent } from '@/modules/order/domain/events/order-reminder.event';

export const EVENTS_MESSAGE_BROKER_CONFIG = {
  [OrderCreatedEvent.name]: {
    exchange: 'orders-topic-exchange',
    routingKey: MESSAGE_PATTERNS.ORDER_CREATED,
  },
  [OrderDeletedEvent.name]: {
    exchange: 'orders-topic-exchange',
    routingKey: MESSAGE_PATTERNS.ORDER_DELETED,
  },
  [OrderReminderEvent.name]: {
    exchange: 'direct.delayed',
    // TODO: aqui eh pra ser o order.paid, mas temporariamente pra teste, vou deixar como created
    routingKey: MESSAGE_PATTERNS.ORDER_CREATED,
  },
};
