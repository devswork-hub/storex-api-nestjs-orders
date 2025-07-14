// export class OrderShippedEvent implements IDomainEvent {
//   readonly eventId: string;
//   readonly eventType = 'OrderShipped';
//   readonly occurredOn: Date;

//   constructor(
//     public readonly aggregateId: string,
//     public readonly trackingNumber: string,
//     public readonly shippingMethod: string,
//   ) {
//     this.eventId = generateId();
//     this.occurredOn = new Date();
//   }
// }
