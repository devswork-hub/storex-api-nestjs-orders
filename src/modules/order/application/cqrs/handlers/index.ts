import { CreateOrderCommandHandler } from './create-order.command';
import { FindAllOrdersHandler } from './find-all-orders.handler';
import { FindOrderByIdHandler } from './find-order-by-id.handler';
import { OrderCreatedHandler } from '../events/order-created.event-handler';

export const CommandHandlers = [CreateOrderCommandHandler];
export const QueryHandlers = [FindAllOrdersHandler, FindOrderByIdHandler];
export const EventHandlers = [OrderCreatedHandler];
