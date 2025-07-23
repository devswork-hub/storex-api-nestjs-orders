import { OutboxTypeORMService } from '@/src/app/persistence/outbox/typeorm/outbox-typeorm.service';
import { OrdersRabbitMQService } from './orders.rabbitmq.service';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
// import { MESSAGE_PATTERNS } from './message-patterns';

@Injectable()
export class OutboxCronService {
  constructor(
    private readonly ordersRabbitMQService: OrdersRabbitMQService,
    private readonly outboxService: OutboxTypeORMService,
  ) {}

  @Cron('*/10 * * * * *')
  async process() {
    try {
      const messages = await this.outboxService.findUnprocessed();
      if (messages.length === 0) return;

      for (const message of messages) {
        const plainMessage = { ...message };
        this.ordersRabbitMQService.sendMessage(plainMessage);
        await this.outboxService.markAsProcessed(plainMessage.id.toString());
      }
    } catch (error) {
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
