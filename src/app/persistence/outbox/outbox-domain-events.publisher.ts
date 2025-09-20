import { Injectable } from '@nestjs/common';
import { OutboxTypeORMService } from '@/app/persistence/outbox/typeorm/outbox-typeorm.service';
import { DomainEventType } from '@/shared/domain/events/domain-event';
import { EntityManager } from 'typeorm';

@Injectable()
export class OutboxDomainEventPublisher {
  constructor(private readonly outbox: OutboxTypeORMService) {}

  async publishAll(events: DomainEventType[], manager?: EntityManager) {
    for (const event of events) {
      await this.outbox.save(event, manager);
    }
  }
}
