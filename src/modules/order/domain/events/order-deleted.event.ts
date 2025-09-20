import { OrderID } from '../order-id';
import { DomainEvent } from './domain-event';

export class OrderDeletedEvent extends DomainEvent<null> {
  constructor(payload: OrderID) {
    super(OrderDeletedEvent.name, payload.getValue(), null);
  }
}
