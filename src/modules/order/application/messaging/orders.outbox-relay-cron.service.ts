import { OrdersRabbitMQService } from './orders.rabbitmq.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OutboxCronExecutorService } from '@/src/app/persistence/outbox/outbox-cron-executor.service';

@Injectable()
export class OrdersOutboxRelayService {
  constructor(
    private readonly cronExecutor: OutboxCronExecutorService,
    private readonly ordersRabbitMQService: OrdersRabbitMQService,
  ) {}

  @Cron('*/10 * * * * *')
  async process() {
    await this.cronExecutor.execute(async (payload) => {
      this.ordersRabbitMQService.sendMessage(payload);
    });
  }
}
