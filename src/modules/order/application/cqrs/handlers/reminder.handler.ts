import { CommandHandler } from '@/shared/domain/cqrs/command-handler';
import { OrderID } from '@/modules/order/domain/order-id';
import { OrderMongoRepository } from '../../order.mongo-repository';
import { OrderStatusEnum } from '@/modules/order/domain/order.constants';
import { RmqPublisherService } from '@/app/messaging/rabbitmq/rmq-publisher.service';
import { OrderReminderEvent } from '@/modules/order/domain/events/order-reminder.event';

export class ReminderHandler implements CommandHandler<OrderID, void> {
  constructor(
    private readonly orderRepository: OrderMongoRepository,
    private readonly rmqPublishService: RmqPublisherService,
  ) {}

  async execute(command: OrderID): Promise<void> {
    const order = await this.orderRepository.findById(command.getValue());
    if (!order) return;

    if (order.status === OrderStatusEnum.PAID) return;

    await this.rmqPublishService.publish(
      new OrderReminderEvent({
        orderId: order.id,
        customerId: order.customerId,
        email: order.customerId,
        reminderType: 'ORDER_PAYMENT',
      }),
    );
  }
}
