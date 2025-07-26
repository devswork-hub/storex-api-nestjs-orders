import { Injectable } from '@nestjs/common';
import { OrderMongoRepository } from '../order.mongo-repository';

// TODO: resolver esse problema do ANY
@Injectable()
export class OrdersProjectionService {
  constructor(private readonly ordersRepository: OrderMongoRepository) {}

  async handle(event: any) {
    switch (event.eventType) {
      case 'OrderCreatedEvent':
        await this.ordersRepository.createOne(event.payload);
        break;
      default:
        console.warn(`⚠️ Evento não tratado: ${event.eventType}`);
    }
  }
}
