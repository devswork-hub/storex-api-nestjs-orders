// src/modules/order/graphql/order.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { OrderOuput } from './outputs/order.output';
import { OrderMapper } from '../order.mapper';
import { FindOneOrderService } from '../../domain/usecases/find-one-order.service';
import { FindAllOrderService } from '../../domain/usecases/find-all-order.service';
import {
  CreateOrderGraphQLInput,
  // UpdateOrderGraphQLInput,
} from './inputs/order.inputs';
import { CreateOrderService } from '../../domain/usecases/create-order/create-order.service';
import { UpdateOrderService } from '../../domain/usecases/update-order.service';
import { DeleteOrderService } from '../../domain/usecases/delete-order/delete-order.service';
import { OrderID } from '../../domain/order-id';
import { CreateOrderValidation } from '../../domain/usecases/create-order/create-order.validation';

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
    const order = await this.findOneOrderService.execute(new OrderID(id));
    return order ? OrderMapper.fromEntitytoGraphQLOrderOutput(order) : null;
  }

  @Mutation(() => OrderOuput)
  async createOrder(
    @Args('input') data: CreateOrderGraphQLInput,
  ): Promise<OrderOuput> {
    const validations = new CreateOrderValidation();
    validations.validate(data); // ✅ Valida antes de mapear para domínio

    const domainInput = OrderMapper.toDomainInput(data); // depois transforma
    const created = await this.createOrderService.execute(domainInput);
    return OrderMapper.fromEntitytoGraphQLOrderOutput(created);
  }

  // @Mutation(() => OrderOuput)
  // async updateOrder(
  //   @Args('id') id: string,
  //   @Args('data') data: UpdateOrderInput,
  // ): Promise<OrderOuput> {
  //   const domainInput = OrderMapper.toDomainInput({ ...data, id });
  //   // const updated = await this.updateOrderService.execute({});
  //   return OrderMapper.fromEntitytoGraphQLOrderOutput(null);
  // }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('id') id: string): Promise<boolean> {
    await this.deleteOrderService.execute(new OrderID(id));
    return true;
  }
}
