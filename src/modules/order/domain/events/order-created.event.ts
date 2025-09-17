import { OrderModelContract } from '../order';
import { DomainEvent } from './domain-event';

export class OrderCreatedEvent extends DomainEvent<OrderModelContract> {
  constructor(payload: OrderModelContract) {
    super(OrderCreatedEvent.name, payload.id, payload);
  }
}
