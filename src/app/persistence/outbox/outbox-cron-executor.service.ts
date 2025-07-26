import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { OutboxTypeORMService } from './typeorm/outbox-typeorm.service';

@Injectable()
export class OutboxCronExecutorService {
  constructor(private readonly outboxService: OutboxTypeORMService) {}

  async execute<T>(handler: (event: T) => Promise<void>) {
    const events = await this.outboxService.findUnprocessed();

    if (events.length === 0) return;

    for (const event of events) {
      const plainEvent = { ...event };
      try {
        await handler(event as T);
        await this.outboxService.markAsProcessed(plainEvent.id.toString());
      } catch (error) {
        throw new ServiceUnavailableException(
          `Erro ao processar evento ${event.id}`,
          error,
        );
      }
    }
  }
}
