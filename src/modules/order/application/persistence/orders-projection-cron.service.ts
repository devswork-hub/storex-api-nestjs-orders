import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OutboxCronExecutorService } from '@/app/persistence/outbox/outbox-cron-executor.service';
import { OrdersProjectionService } from './orders-projection.service';
import { OutboxContract } from '@/app/persistence/outbox/outbox.contract';
import { OrderCreatedEvent } from '../../domain/events/order-created.event';

@Injectable()
export class OrdersProjectionCronService {
  constructor(
    private readonly cronExecutor: OutboxCronExecutorService,
    private readonly ordersProjectService: OrdersProjectionService,
  ) {}

  @Cron('*/10 * * * * *')
  async process() {
    await this.cronExecutor.execute<OutboxContract<OrderCreatedEvent>>(
      async (event) => {
        this.ordersProjectService.handle(event);
      },
    );
  }
}
