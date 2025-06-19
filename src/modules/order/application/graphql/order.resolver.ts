// src/modules/order/graphql/order.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderOuput } from './outputs/order.output';
import { OrderMapper } from '../order.mapper';
import { CreateOrderService } from '../../domain/usecases/create-order.service';
import { UpdateOrderService } from '../../domain/usecases/update-order.service';
import { DeleteOrderService } from '../../domain/usecases/delete-order.service';
import { FindOneOrderService } from '../../domain/usecases/find-one-order.service';
import { FindAllOrderService } from '../../domain/usecases/find-all-order.service';
import { CreateOrderInput, UpdateOrderInput } from './inputs/order.input';

@Resolver(() => OrderOuput)
export class OrderResolver {
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly updateOrderService: UpdateOrderService,
    private readonly deleteOrderService: DeleteOrderService,
    private readonly findOneOrderService: FindOneOrderService,
    private readonly findAllOrdersService: FindAllOrderService,
  ) {}

  @Query(() => String, { name: 'healthCheck' })
  healthCheck(): string {
    return 'GraphQL está rodando!';
  }

  // @Query(() => [OrderOuput])
  // async findAllOrders(): Promise<OrderOuput[]> {
  //   const orders = await this.findAllOrdersService.execute();
  //   return orders.map(OrderMapper.fromEntitytoGraphQLOrderOutput);
  // }

  @Query(() => [OrderOuput])
  async findAllOrders() {
    try {
      const orders = await this.findAllOrdersService.execute();
      console.log('Orders:', orders.length);
      return orders.map((order) =>
        OrderMapper.fromEntitytoGraphQLOrderOutput(order),
      );
    } catch (error) {
      console.error('Erro ao mapear orders:', error);
      throw error;
    }
  }
  @Query(() => OrderOuput, { nullable: true })
  async findOrderById(@Args('id') id: string): Promise<OrderOuput | null> {
    const order = await this.findOneOrderService.execute(id);
    return order ? OrderMapper.fromEntitytoGraphQLOrderOutput(order) : null;
  }

  @Mutation(() => OrderOuput)
  async createOrder(
    @Args('input') data: CreateOrderInput,
  ): Promise<OrderOuput> {
    const domainInput = OrderMapper.toDomainInput(data);
    const created = await this.createOrderService.execute(domainInput);
    return OrderMapper.fromEntitytoGraphQLOrderOutput(created);
  }

  @Mutation(() => OrderOuput)
  async updateOrder(
    @Args('id') id: string,
    @Args('data') data: UpdateOrderInput,
  ): Promise<OrderOuput> {
    const domainInput = OrderMapper.toDomainInput({ ...data, id });
    // const updated = await this.updateOrderService.execute({});
    return OrderMapper.fromEntitytoGraphQLOrderOutput(null);
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('id') id: string): Promise<boolean> {
    await this.deleteOrderService.execute(id);
    return true;
  }
}
