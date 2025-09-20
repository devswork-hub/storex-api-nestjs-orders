import { Injectable, Logger } from '@nestjs/common';
import { OrderMongoRepository } from '../order.mongo-repository';
import { OrderMongoMapper } from '../mongo/order-mongo.mapper';
import { CacheService } from '@/app/persistence/cache/cache.service';
import { ORDER_CACHE_KEYS } from '../orders-cache-keys';

@Injectable()
export class OrdersProjectionService {
  private logger = new Logger(OrdersProjectionService.name);

  constructor(
    private readonly ordersRepository: OrderMongoRepository,
    private readonly cacheService: CacheService,
  ) {}

  async handle(event: any) {
    switch (event.eventType) {
      case 'OrderCreatedEvent':
        await this.projectAndInvalidateCache(async () => {
          const orderDomain = OrderMongoMapper.toDomain(event.payload);
          await this.ordersRepository.createOne(orderDomain);
        }, `OrderCreatedEvent for orderId: ${event.payload.id}`);
        break;

      case 'OrderDeletedEvent':
        await this.projectAndInvalidateCache(async () => {
          await this.ordersRepository.delete(event.aggregateId);
        }, `OrderDeletedEvent for orderId: ${event.aggregateId}`);
        break;

      default:
        this.logger.warn(`⚠️ Evento não tratado: ${event.eventType}`);
    }
  }

  private async projectAndInvalidateCache(
    projectionFn: () => Promise<void>,
    logMessage: string,
  ) {
    this.logger.log(`Projecting ${logMessage}`);
    await projectionFn();
    await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);
    this.logger.log(`Cache invalidado após ${logMessage}`);
  }
}
