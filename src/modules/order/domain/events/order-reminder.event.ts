import { DomainEvent } from './domain-event';

type OrderReminderPayload = {
  orderId: string;
  customerId: string;
  email: string;
};

export class OrderReminderEvent extends DomainEvent<OrderReminderPayload> {
  constructor(payload: OrderReminderPayload) {
    super(OrderReminderEvent.name, payload.orderId, payload);
  }
}
