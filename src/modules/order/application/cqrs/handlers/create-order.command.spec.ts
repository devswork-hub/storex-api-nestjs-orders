// // import { DomainEventBus } from '../../../../../shared/domain/events/domain-event-bus';
// // import { StubEvent } from '../../../../../shared/domain/events/stub-event';
// // import { CreateOrderTransactionCommandHandler } from './create-order-transaction.command';

// import { OrderInMemoryRepository } from '@/modules/order/domain/persistence/order.in-memory.repository';
// import { OrderWritableRepositoryContract } from '../../persistence/order.respository';
// import { CreateOrderTransactionCommandHandler } from './create-order-transaction.command';

// // describe(CreateOrderTransactionCommandHandler.name, () => {
// //   let eventBus: DomainEventBus;

// //   beforeAll(() => {
// //     eventBus: new DomainEventBus();
// //   });

// //   it('should allow subscribing and publishing events', async () => {
// //     const handler = {
// //       handle: jest.fn(),
// //     };

// //     eventBus.subscribe('OrderCreated', handler);

// //     const stubEvent = StubEvent.create();

// //     await eventBus.publish(stubEvent);

// //     expect(handler.handle).toHaveBeenCalledWith(stubEvent);
// //   });
// // });

// describe(CreateOrderTransactionCommandHandler.name, () => {
//   let command: CreateOrderTransactionCommandHandler;
//   let repo: OrderWritableRepositoryContract;

//   beforeEach(() => {
//     repo: new OrderInMemoryRepository(),
//     command: new CreateOrderTransactionCommandHandler(repo);
//   });

//   it('should', () => {});
// });
