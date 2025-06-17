import { Query, Resolver } from '@nestjs/graphql';
import { OrderService } from '../order.service';
import { OrderMongoSchema } from '../mongo/order.schema';
import { CreateOrderService } from '../../usecases/create-order.usecase';
import { OrderOuput } from './order.output';

@Resolver(() => OrderOuput)
export class OrderItemResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly createOrderService: CreateOrderService,
  ) {}

  // // @Query(() => [OrderItem], { name: 'orderItems' }) -> Posso customizar o nome da query, mas não é necessário
  // @Query(() => [OrderItem])
  // async getOrderItems(): Promise<OrderItem[]> {
  //   return this.orderService.findAll();
  // }

  // @Mutation(() => OrderMongoSchema)
  // async createOrder(@Args('input') input: CreateOrderDTO) {
  //   return this.createOrderService.execute(input);
  // }

  @Query(() => [OrderMongoSchema])
  async getOrders(): Promise<OrderMongoSchema[]> {
    return this.orderService.finAllOrdersTest();
  }
}
