import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrderService } from '../../../domain/usecases/find-all-order.service';
import { OrderMapper } from '../../order.mapper';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { CacheService } from '@/app/persistence/cache/cache.service';
import { Logger } from '@nestjs/common';

export class FindAllOrdersQuery {}

@QueryHandler(FindAllOrdersQuery)
export class FindAllOrdersHandler
  implements IQueryHandler<FindAllOrdersQuery, OrderOuput[]>
{
  private logger = new Logger(FindAllOrdersHandler.name);
  constructor(
    private readonly findAllOrdersService: FindAllOrderService,
    private readonly cacheService: CacheService,
  ) {}

  async execute(): Promise<OrderOuput[]> {
    const cacheKey = ORDER_CACHE_KEYS.FIND_ALL;
    this.logger.log('Iniciei o handler');

    const cached = await this.cacheService.get<OrderOuput[]>(cacheKey);
    if (cached) {
      this.logger.log('Com cache');
      return cached;
    }
    const result = await this.findAllOrdersService.execute(); // repository deve usar .lean()

    this.logger.log('Sem cache');
    const mapped = result.map((m) =>
      OrderMapper.fromEntitytoGraphQLOrderOutput(m),
    );

    await this.cacheService.set(cacheKey, mapped, 60); // plain objects
    return mapped;
  }
}
