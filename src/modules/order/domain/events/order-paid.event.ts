import { DomainEvent } from './domain-event';

type OrderPaidPayload = {
  id: string;
  paymentId: string;
  paymentStatus: string;
  amount: number;
};

export class OrderPaidEvent extends DomainEvent<OrderPaidPayload> {
  constructor(payload: OrderPaidPayload) {
    super(OrderPaidEvent.name, payload.id, payload);
  }
}
