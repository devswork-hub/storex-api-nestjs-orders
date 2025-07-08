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
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(): Promise<OrderOuput[]> {
    const cacheKey = ORDER_CACHE_KEYS.FIND_ALL;

    // const cached = await this.cacheManager.get<OrderOuput[]>(cacheKey);

    // if (cached) {
    //   this.logger.log(`[CACHE HIT] Chave: ${cacheKey}`);
    //   return cached;
    // }

    this.logger.log(`[CACHE MISS] Chave: ${cacheKey}`);

    // this.logger.log(
    //   `CacheManager instance: ${JSON.stringify(this.cacheManager, null, 2)}`,
    // );

    const result = await this.findAllOrdersService.execute();
    const output = result.map(OrderMapper.fromEntitytoGraphQLOrderOutput);

    this.logger.log(`[CACHE SAVE] Salvando na chave ${cacheKey}`);

    // await this.cacheManager.set(cacheKey, output, 60);

    return output;
  }
}
