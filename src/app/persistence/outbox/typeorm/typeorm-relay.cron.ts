import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxTypeORMService } from './outbox-typeorm.service';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class TypeORMOutboxRelayCronProcessorService {
  private readonly logger = new Logger(
    TypeORMOutboxRelayCronProcessorService.name,
  );

  constructor(
    private readonly outboxTypeORMService: OutboxTypeORMService,
    private readonly eventBusService: EventBus,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async processOutboxEvents() {
    try {
      this.logger.debug('Procurando eventos não processados no Outbox...');
      const unprocessedEvents =
        await this.outboxTypeORMService.findUnprocessed();

      if (unprocessedEvents.length === 0) {
        this.logger.debug('Nenhum evento não processado encontrado.');
        return;
      }

      for (const event of unprocessedEvents) {
        try {
          // Disclaimer: This is a placeholder for the actual event processing logic.
          // You should replace this with your actual event handling logic.
          this.eventBusService.publish(event);
          this.logger.log(
            `Evento '${event.eventType}' (ID: ${event.id}) publicado com sucesso.`,
          );

          await this.outboxTypeORMService.markAsProcessed(event.id.toString());
          this.logger.log(`Evento (ID: ${event.id}) marcado como processado.`);
        } catch (eventError) {
          this.logger.error(
            `Falha ao processar ou publicar evento (ID: ${event.id}, Tipo: ${event.eventType}): ${eventError.message}`,
            eventError.stack,
          );
          // Você pode querer adicionar lógica de retry ou mover para um status de 'failed'
          // em vez de simplesmente lançar o erro aqui, para não parar o processamento de outros eventos.
          // await this.outboxRepository.markEventAsFailed(event.id.toString(), eventError.message);
        }
      }
    } catch (error) {
      this.logger.error(
        `Erro ao buscar ou despachar eventos do Outbox: ${error.message}`,
        error.stack,
      );
    }
  }
}
