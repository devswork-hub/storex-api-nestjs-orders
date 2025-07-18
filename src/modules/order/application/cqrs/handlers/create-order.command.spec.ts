// import { DomainEventBus } from '../../../../../shared/domain/events/domain-event-bus';
// import { CreateOrderCommand } from './create-order.command';
// import { StubEvent } from '../../../../../shared/domain/events/stub-event';

// describe(CreateOrderCommand.name, () => {
//   let eventBus: DomainEventBus;

//   beforeAll(() => {
//     eventBus: new DomainEventBus();
//   });

//   it('should allow subscribing and publishing events', async () => {
//     const handler = {
//       handle: jest.fn(),
//     };

//     eventBus.subscribe('OrderCreated', handler);

//     const stubEvent = StubEvent.create();

//     await eventBus.publish(stubEvent);

//     expect(handler.handle).toHaveBeenCalledWith(stubEvent);
//   });
// });
