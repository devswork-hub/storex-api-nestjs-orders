import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrderService } from '../../../domain/usecases/find-all-order.service';
import { OrderMapper } from '../../order.mapper';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { CacheService } from '@/app/persistence/cache/cache.service';

export class FindAllOrdersQuery {}

@QueryHandler(FindAllOrdersQuery)
export class FindAllOrdersHandler
  implements IQueryHandler<FindAllOrdersQuery, OrderOuput[]>
{
  constructor(
    private readonly findAllOrdersService: FindAllOrderService,
    private readonly cacheService: CacheService,
  ) {}

  async execute(): Promise<OrderOuput[]> {
    const cacheKey = ORDER_CACHE_KEYS.FIND_ALL;

    try {
      const cached = await this.cacheService.get<OrderOuput[]>(cacheKey);
      if (cached) return cached;
    } catch (e) {
      throw new Error(e);
    }

    const result = await this.findAllOrdersService.execute();

    const mapped = result.map((m) =>
      OrderMapper.fromEntitytoGraphQLOrderOutput(m),
    );
    await this.cacheService.set(cacheKey, mapped, 60);
    return mapped;
  }
}
