import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, LessThan } from 'typeorm';
import { OutboxTypeORMEntity } from './outbox-typeorm.entity';
import { DomainEventType } from '@/shared/domain/events/domain-event';

@Injectable()
export class OutboxTypeORMService {
  constructor(
    @InjectRepository(OutboxTypeORMEntity)
    private readonly repo: Repository<OutboxTypeORMEntity>,
  ) {}

  async save<E extends DomainEventType>(
    event: E,
    manager?: EntityManager,
  ): Promise<void> {
    if (!event.payload || typeof event.payload !== 'object') {
      throw new Error('Payload inválido para evento do Outbox');
    }

    const repo = manager
      ? manager.getRepository(OutboxTypeORMEntity)
      : this.repo;

    await repo.save({
      aggregateType: event.constructor.name.replace('Event', ''),
      aggregateId: event.aggregateId,
      eventType: event.eventType,
      payload: event.payload,
      processed: false,
    });
  }

  async findUnprocessed(limit = 10): Promise<OutboxTypeORMEntity[]> {
    return this.repo.find({
      where: { processed: false },
      take: limit,
      order: { createdAt: 'ASC' },
    });
  }

  async markAsProcessed(id: string, manager?: EntityManager): Promise<void> {
    const repo = manager
      ? manager.getRepository(OutboxTypeORMEntity)
      : this.repo;

    await repo.update(id, { processed: true });
  }

  async deleteOldProcessed(days: number): Promise<void> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    await this.repo.delete({
      processed: true,
      createdAt: LessThan(date),
    });
  }
}
