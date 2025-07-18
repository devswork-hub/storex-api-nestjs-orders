import { DomainEventType } from '../../../../shared/domain/events/domain-event';
import { UUID } from '../../../../shared/domain/value-objects/uuid.vo';
import { BillingAddress, ShippingSnapshot } from '../order.constants';
import { OrderItemModelContract } from '../order-item';

type OrderCreatedPayload = {
  id: string;
  customerId: string;
  status: string;
  createdAt: Date;
  totalAmount: number;
  currency: string;
  paymentId: string;
  shippingAddress: ShippingSnapshot;
  billingAddress: BillingAddress;
  items: OrderItemModelContract[];
};

export class OrderCreatedEvent implements DomainEventType {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly occurredOn: Date;
  // TODO: validar se é util ou nao
  readonly eventVersion?: string;
  readonly payload: OrderCreatedPayload;

  constructor(payload: OrderCreatedPayload) {
    this.eventId = new UUID().toString();
    this.eventType = OrderCreatedEvent.name;
    this.aggregateId = payload.id;
    this.occurredOn = new Date();
    this.payload = payload;
  }
}
