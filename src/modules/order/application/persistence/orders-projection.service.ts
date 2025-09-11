import { Injectable, Logger } from '@nestjs/common';
import { OrderMongoRepository } from '../order.mongo-repository';

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
        await this.ordersRepository.createOne(event.payload);
        break;
      default:
        console.warn(`⚠️ Evento não tratado: ${event.eventType}`);
    }
  }
}
