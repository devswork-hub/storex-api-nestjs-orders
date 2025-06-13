import { Query, Resolver } from '@nestjs/graphql';
import { OrderItem } from './order-item.schema';
import { OrderService } from '../order.service';
import { OrderMongoSchema } from '../mongo/order.schema';

@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(private readonly orderService: OrderService) {}

  // @Query(() => [OrderItem], { name: 'orderItems' }) -> Posso customizar o nome da query, mas não é necessário
  @Query(() => [OrderItem])
  async getOrderItems(): Promise<OrderItem[]> {
    return this.orderService.findAll();
  }

  @Query(() => [OrderMongoSchema])
  async getOrders(): Promise<OrderMongoSchema[]> {
    return this.orderService.finAllOrdersTest();
  }
}
