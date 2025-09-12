import { Injectable, Logger } from '@nestjs/common';
import { OrderMongoRepository } from '../order.mongo-repository';
import { OrderMongoMapper } from '../mongo/order-mongo.mapper';
import { OrderStatus } from '../../domain/order.constants';

// TODO: resolver esse problema do ANY
@Injectable()
export class OrdersProjectionService {
  private logger = new Logger(OrdersProjectionService.name);
  constructor(private readonly ordersRepository: OrderMongoRepository) {}

  async handle(event: any) {
    switch (event.eventType) {
      case 'OrderCreatedEvent':
        this.logger.log(
          `Projecting OrderCreatedEvent for orderId: ${event.payload.id}`,
        );
        const orderDomain = OrderMongoMapper.toDomain(event.payload);
        await this.ordersRepository.createOne(orderDomain);
        break;
      default:
        console.warn(`⚠️ Evento não tratado: ${event.eventType}`);
    }
  }
}
