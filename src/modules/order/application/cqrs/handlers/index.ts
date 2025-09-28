import { FindAllOrdersHandler } from './find-all-orders.handler';
import { FindOrderByIdHandler } from './find-order-by-id.handler';
import { CreateOrderTransactionCommandHandler } from './create-order-transaction.command';
import { DeleteOrderCommandHandler } from './delete-order.handler';

export const CommandHandlers = [
  CreateOrderTransactionCommandHandler,
  DeleteOrderCommandHandler,
];
export const QueryHandlers = [FindAllOrdersHandler, FindOrderByIdHandler];
export const EventHandlers = [];
