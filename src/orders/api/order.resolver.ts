import { Query, Resolver } from '@nestjs/graphql';
import { OrderItem } from './order-item.schema';
import { OrderService } from './order.service';

@Resolver(() => OrderItem)
export class OrderItemResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderItem], { name: 'orderItems' })
  async getOrderItems(): Promise<OrderItem[]> {
    return this.orderService.findAll();
  }
}
