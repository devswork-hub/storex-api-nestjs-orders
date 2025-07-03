import { CreateOrderCommandHandler } from './create-order.command';
import { FindAllOrdersHandler } from './find-all-orders.handler';
import { FindOrderByIdHandler } from './find-order-by-id.handler';

export const CommandHandlers = [
  CreateOrderCommandHandler,
  FindAllOrdersHandler,
  FindOrderByIdHandler,
];
