import { OrdersRabbitMQService } from './orders.rabbitmq.service';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OutboxCronExecutorService } from '@/src/app/persistence/outbox/outbox-cron-executor.service';
import { RmqPublisherService } from '@/src/app/messaging/rabbitmq/rmq-publisher.service';

@Injectable()
export class OrdersOutboxRelayService {
  constructor(
    private readonly cronExecutor: OutboxCronExecutorService,
    private readonly rmbPublishService: RmqPublisherService,
  ) {}

  @Cron('*/10 * * * * *')
  async process() {
    await this.cronExecutor.execute(async (payload) => {
      this.rmbPublishService.publish(payload as any);
    });
  }
}
