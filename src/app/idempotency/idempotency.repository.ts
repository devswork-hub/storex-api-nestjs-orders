import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { OrderIdempotencyEntity } from './idempotency.entity';

@Injectable()
export class OrderIdempotencyRepository {
  private repo: Repository<OrderIdempotencyEntity>;

  async find(
    clientId: string,
    idempotencyKey: string,
  ): Promise<OrderIdempotencyEntity | null> {
    return this.repo.findOneBy({
      clientId,
      idempotencyKey,
    });
  }

  async save(record: OrderIdempotencyEntity): Promise<void> {
    await this.repo.save(record);
  }

  setTransactionManager(manager: EntityManager) {
    this.repo = manager.getRepository(OrderIdempotencyEntity);
  }
}
