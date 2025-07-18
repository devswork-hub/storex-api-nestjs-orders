import { EventBus, IEvent } from '@nestjs/cqrs';
import { OutboxTypeORMService } from './outbox-typeorm.service';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

export class OutboxEventIntervalSample implements IEvent {
  constructor(public readonly payload: any) {}
}

@Injectable()
export class TypeORMOutboxIntervalProcessorService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(
    TypeORMOutboxIntervalProcessorService.name,
  );
  private interval: NodeJS.Timeout;

  constructor(
    private readonly outboxTypeORMService: OutboxTypeORMService, // Substitua pelo seu repositório TypeORM
    private readonly eventBusService: EventBus,
  ) {}

  onModuleInit() {
    // this.logger.log('⏱️ Interval processor iniciado.');
    this.interval = setInterval(() => this.processOutbox(), 5000);
  }

  onModuleDestroy() {
    clearInterval(this.interval);
  }

  private async processOutbox() {
    // this.logger.debug('⏳ processOutbox foi chamado!');
    try {
      const unprocessedMessages =
        await this.outboxTypeORMService.findUnprocessed(100);

      if (unprocessedMessages.length === 0) {
        // this.logger.debug('📥 Não há mensagens não processadas.');
        return;
      }

      for (const message of unprocessedMessages) {
        try {
          await this.eventBusService.publish(
            new OutboxEventIntervalSample(message),
          );

          // Aqui vai a lógica para marcar a mensagem como processada

          // this.logger.debug(
          //   `Message ${message.id} sent and marked as processed.`,
          // );
        } catch (innerError) {
          // this.logger.error(
          //   `Failed to send message ${message.id}:`,
          //   innerError.message,
          // );
          // Opcional: Implementar lógica de retry ou DLQ (Dead Letter Queue)
        }
      }
    } catch (error) {
      console.error('Error processing outbox:', error.message);
    }
  }
}
