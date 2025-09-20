// import { CreateOrderCommandHandler } from './create-order.command';
import { FindAllOrdersHandler } from './find-all-orders.handler';
import { FindOrderByIdHandler } from './find-order-by-id.handler';
// import { OrderCreatedHandler } from '../events/order-created.event-handler';
import { CreateOrderTransactionCommandHandler } from './create-order-transaction.command';
import { DeleteOrderCommandHandler } from './delete-order.handler';

export const CommandHandlers = [
  // CreateOrderCommandHandler,
  CreateOrderTransactionCommandHandler,
  DeleteOrderCommandHandler,
];
export const QueryHandlers = [FindAllOrdersHandler, FindOrderByIdHandler];
// export const EventHandlers = [OrderCreatedHandler];
export const EventHandlers = [];
