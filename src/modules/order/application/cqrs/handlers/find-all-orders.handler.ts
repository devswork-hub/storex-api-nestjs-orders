import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrderService } from '../../../domain/usecases/find-all-order.service';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { OrderMapper } from '../../order.mapper';
import { Inject, Logger } from '@nestjs/common';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

export class FindAllOrdersQuery {}

@QueryHandler(FindAllOrdersQuery)
export class FindAllOrdersHandler
  implements IQueryHandler<FindAllOrdersQuery, OrderOuput[]>
{
  private readonly logger = new Logger(FindAllOrdersHandler.name);

  constructor(
    private readonly findAllOrdersService: FindAllOrderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(): Promise<OrderOuput[]> {
    const cacheKey = ORDER_CACHE_KEYS.FIND_ALL;
    const cached = await this.cacheManager.get<OrderOuput[]>(cacheKey);

    if (cached) {
      this.logger.log(`[CACHE HIT] Chave: ${cacheKey}`);
      return cached;
    }

    this.logger.log(`[CACHE MISS] Chave: ${cacheKey}`);

    const result = await this.findAllOrdersService.execute();
    this.logger.log(
      `[CACHE SET] Armazenando resultado no cache para chave: ${cacheKey}`,
    );

    await this.cacheManager.set(cacheKey, result, 10);

    this.logger.debug(`Valor armazenado no cache: ${JSON.stringify(result)}`);

    return result.map((order) =>
      OrderMapper.fromEntitytoGraphQLOrderOutput(order),
    );
  }
}
