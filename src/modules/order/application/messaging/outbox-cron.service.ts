import { OutboxTypeORMService } from '@/src/app/persistence/outbox/typeorm/outbox-typeorm.service';
import { OrdersRabbitMQService } from './orders.rabbitmq.service';
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// import { MESSAGE_PATTERNS } from './message-patterns';
// import { measureMemory } from 'vm';

@Injectable()
export class OutboxCronService {
  private logger = new Logger(OutboxCronService.name);
  constructor(
    private readonly ordersRabbitMQService: OrdersRabbitMQService,
    private readonly outboxService: OutboxTypeORMService,
  ) {}

  @Cron('*/10 * * * * *')
  async process() {
    try {
      this.logger.log('[START] Processing outbox messages');
      const messages = await this.outboxService.findUnprocessed();

      if (messages.length === 0) {
        this.logger.log('[FINISH] No unprocessed messages found');
        return;
      }

      for (const message of messages) {
        const plainMessage = { ...message };
        this.ordersRabbitMQService.sendMessage(plainMessage);
        await this.outboxService.markAsProcessed(message.id.toString());
      }

      this.logger.log('[FINISH] Processing outbox messages');
    } catch (error) {
      console.error('Error processing outbox messages:', error);
      throw new ServiceUnavailableException(
        'Failed to process outbox messages',
      );
    }
  }

  // private async publishEvent(event: any) {
  //   const payload = JSON.parse(event.payload);

  //   // Usar ClientProxy para emitir eventos
  //   switch (event.eventType) {
  //     case 'order.created':
  //       this.ordersRabbitMQService.sendMessage(
  //         MESSAGE_PATTERNS.ORDER_CREATED,
  //         payload,
  //       );
  //       break;
  //     case 'order.updated':
  //       this.ordersRabbitMQService.sendMessage(
  //         MESSAGE_PATTERNS.ORDER_UPDATED,
  //         payload,
  //       );
  //       break;
  //     case 'order.cancelled':
  //       this.ordersRabbitMQService.sendMessage(
  //         MESSAGE_PATTERNS.ORDER_CANCELLED,
  //         payload,
  //       );
  //       break;
  //   }
  // }
}
