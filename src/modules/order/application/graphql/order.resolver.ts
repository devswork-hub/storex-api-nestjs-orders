import {
  Resolver,
  Query,
  Mutation,
  Args,
  Subscription,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { OrderOuput } from './outputs/order.output';
import { CreateOrderGraphQLInput } from './inputs/order.inputs';
import { UpdateOrderService } from '../../domain/usecases/update-order.service';
import { DeleteOrderService } from '../../domain/usecases/delete-order/delete-order.service';
import { OrderID } from '../../domain/order-id';
import { OrderMapper } from '../order.mapper';
import { UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from '@/app/interceptors/logging.interceptor';
import { OrderStatus, OrderStatusEnum } from '../../domain/order.constants';
import { PaginatedOrderResult } from './outputs/search.output';
import {
  OrderFilterInput,
  OrderSortInput,
  PaginationInput,
} from './inputs/search.input';
import { OrderMongoRepository } from '../order.mongo-repository';
import { OrderModelContract } from '../../domain/order';
import {
  CursorSearchResult,
  OffsetSearchResult,
  SearchResult,
} from '@/shared/persistence/search/searchable.repository.contract';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindAllOrdersQuery } from '../cqrs/handlers/find-all-orders.handler';
import { FindOrderByIdQuery } from '../cqrs/handlers/find-order-by-id.handler';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ORDER_CACHE_KEYS } from '../orders-cache-keys';
import { CreateOrderCommand } from '../cqrs/handlers/create-order-transaction.command';

@Resolver(() => OrderOuput)
export class OrderResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly updateOrderService: UpdateOrderService,
    private readonly deleteOrderService: DeleteOrderService,
    private readonly repo: OrderMongoRepository,
  ) {}

  @Query(() => String, { name: 'healthCheck' })
  healthCheck(): string {
    return 'GraphQL está rodando!';
  }

  // Nao funciona com GraphQL, a abordagem deve ser manual
  // @UseInterceptors(LoggingInterceptor, CacheInterceptor) // Automatically cache the response for this endpoint
  // @CacheKey(ORDER_CACHE_KEYS.FIND_ALL)
  // @CacheTTL(60000) // now in milliseconds (1 minute === 60000)
  @Query(() => [OrderOuput])
  async findAllOrders() {
    try {
      return await this.queryBus.execute(new FindAllOrdersQuery());
    } catch (error) {
      throw error;
    }
  }
  @Query(() => OrderOuput, { nullable: true })
  async findOrderById(@Args('id') id: string): Promise<OrderOuput | null> {
    return await this.queryBus.execute(
      new FindOrderByIdQuery(new OrderID(id).getValue()),
    );
  }

  @Mutation(() => OrderOuput)
  async createOrder(
    @Args('input') data: CreateOrderGraphQLInput,
  ): Promise<OrderOuput> {
    return await this.commandBus.execute(new CreateOrderCommand(data));
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

  @Subscription(() => OrderStatusUpdateType, {
    name: 'orderUpdated',
    filter: (payload, variables) => {
      return payload.orderUpdated.orderId === variables.orderId;
    },
  })
  async orderUpdated(@Args('orderId') orderId: string) {
    // return this.pubSub.asyncIterator(`orderUpdated.${orderId}`);
  }

  // @Query(() => [PaginationOutput])
  // async findPaginatedOrders(
  //   @Args('page', { type: () => Number, nullable: true, defaultValue: 1 })
  //   page: number,
  //   @Args('limit', { type: () => Number, nullable: true, defaultValue: 10 })
  //   limit: number,
  // ): Promise<PaginationOutput[]> {
  //   const orders = await this.findAllOrdersService.execute({ page, limit });
  //   return orders.map((order) =>
  //     OrderMapper.fromEntitytoGraphQLOrderOutput(order),
  //   );
  // }

  @Query(() => PaginatedOrderResult, { name: 'searchOrders' })
  async searchOrders(
    @Args('filter', { nullable: true }) filter?: OrderFilterInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    @Args('sort', { nullable: true }) sort?: OrderSortInput,
  ): Promise<typeof PaginatedOrderResult> {
    const paginationType = pagination?.type ?? 'offset';

    const paginationWithType =
      paginationType === 'cursor'
        ? { type: 'cursor' as const, ...pagination?.cursor }
        : { type: 'offset' as const, ...pagination?.offset };

    const mappedFilter = filter?.status
      ? {
          ...filter,
          status: OrderStatusEnum[
            filter.status as keyof typeof OrderStatusEnum
          ] as OrderStatus,
        }
      : filter;

    const allowedFields = [
      'items',
      'status',
      'currency',
      'paymentSnapshot',
      'shippingSnapshot',
      'billingAddress',
      'customerId',
      'paymentId',
      'notes',
      'discount',
      'id',
      'createdAt',
      'updatedAt',
    ] as const;

    const mappedSort =
      sort && allowedFields.includes(sort.field as any)
        ? {
            field: sort.field as (typeof allowedFields)[number],
            direction: sort.direction,
          }
        : undefined;

    const result = await this.repo.search({
      filter: mappedFilter as Partial<OrderModelContract>,
      pagination: paginationWithType,
      sort: mappedSort,
    });

    // if ('type' in result && result.type === 'offset') {
    //   // Agora o TS sabe que é OffsetSearchResult
    //   return {
    //     ...result,
    //     items: result.items.map(OrderMapper.fromEntitytoGraphQLOrderOutput),
    //   };
    // }

    // if ('type' in result && result.type === 'cursor') {
    //   return {
    //     ...result,
    //     items: result.items.map(OrderMapper.fromEntitytoGraphQLOrderOutput),
    //   };
    // }
    // const typed = result as
    //   | OffsetSearchResult<OrderModelContract>
    //   | CursorSearchResult<OrderModelContract>;

    // if (typed.type === 'offset') {
    //   return {
    //     ...typed,
    //     items: typed.items.map(OrderMapper.fromEntitytoGraphQLOrderOutput),
    //   };
    // }

    if (isOffset(result)) {
      return {
        ...result,
        items: result.items.map(OrderMapper.fromEntitytoGraphQLOrderOutput),
      };
    }

    // fallback só se quiser
    throw new Error('Unknown pagination type');
  }
}
function isOffset<T>(res: SearchResult<T>): res is OffsetSearchResult<T> {
  return 'type' in res && res.type === 'offset';
}

function isCursor<T>(res: SearchResult<T>): res is CursorSearchResult<T> {
  return 'type' in res && res.type === 'cursor';
}

@ObjectType()
export class OrderStatusUpdateType {
  @Field()
  orderId: string;

  @Field(() => OrderStatusEnum)
  status: OrderStatus;
}
