import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindOneOrderService } from '@/src/modules/order/domain/usecases/find-one-order.service';
import { OrderID } from '@/src/modules/order/domain/order-id';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { OrderMapper } from '../../order.mapper';
import { CacheService } from '@/src/app/persistence/cache/cache.service';
import { Logger } from '@nestjs/common';

export class FindOrderByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(FindOrderByIdQuery)
export class FindOrderByIdHandler
  implements IQueryHandler<FindOrderByIdQuery, OrderOuput | null>
{
  private logger = new Logger(FindOrderByIdHandler.name);
  constructor(
    private readonly findOneOrderService: FindOneOrderService,
    private readonly cacheService: CacheService,
  ) {}

  async execute(query: FindOrderByIdQuery): Promise<OrderOuput | null> {
    const cacheKey = `order_${query.id}`;

    let order = await this.cacheService.get<OrderOuput>(cacheKey);

    if (order) {
      this.logger.log(`Pedido ${query.id} encontrado no cache!`);
      return order;
    }

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
