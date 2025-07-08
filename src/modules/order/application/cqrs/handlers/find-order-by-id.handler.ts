import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderModelContract } from '@/src/modules/order/domain/order';
import { FindOneOrderService } from '@/src/modules/order/domain/usecases/find-one-order.service';
import { OrderID } from '@/src/modules/order/domain/order-id';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { OrderMapper } from '../../order.mapper';
import { Cache } from 'cache-manager';
import { CacheService } from '@/src/app/persistence/cache/cache.service';

export class FindOrderByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(FindOrderByIdQuery)
export class FindOrderByIdHandler
  implements IQueryHandler<FindOrderByIdQuery, OrderOuput | null>
{
  constructor(
    private readonly findOneOrderService: FindOneOrderService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly cacheService: CacheService,
  ) {
    cacheService.get('order_').then((d) => console.log(`====`, d));
  }

  async execute(query: FindOrderByIdQuery): Promise<OrderOuput | null> {
    const cacheKey = `order_`;

    let order = await this.cacheService.get<OrderOuput>(cacheKey);

    if (order) {
      console.log(`Pedido ${query.id} encontrado no cache!`);
      return order;
    }

    console.log(`Buscando pedido ${query.id} no banco de dados...`);
    const result = await this.findOneOrderService.execute(
      new OrderID(query.id),
    );

    if (result) {
      order = OrderMapper.fromEntitytoGraphQLOrderOutput(result);
      await this.cacheService.set(cacheKey, order, 60);
      return order;
    }
    return null;
  }
}
