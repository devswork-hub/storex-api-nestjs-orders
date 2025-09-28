import { MailQueueService } from '@/app/integrations/mail/mail-queue.service';
import { OrderCreatedEvent } from '@/modules/order/domain/events/order-created.event';
import { Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { custom } from 'zod';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedEventHandler
  implements IEventHandler<OrderCreatedEvent>
{
  private logger = new Logger(OrderCreatedEventHandler.name);

  constructor(private readonly mailQueueService: MailQueueService) {}

  async handle(event: OrderCreatedEvent) {
    const customerName = event.payload.customerSnapshot.name;

    this.logger.log(`Send email to ${custom}, about order ${event.payload.id}`);

    await this.mailQueueService.dispatchTasks({
      payload: {
        to: event.payload.customerSnapshot.email,
        subject: 'Confirmação do Pedido',
        body: `Olá ${customerName}, seu pedido foi recebido com sucesso!`,
      },
    });
  }
}
