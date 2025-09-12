import {
  BadRequestException,
  Controller,
  Logger,
  UseFilters,
} from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQConsumerErrorFilter } from '@/app/messaging/rabbitmq/rabbitmq-consumer-error.filter';
import { RmqPublisherService } from '@/app/messaging/rabbitmq/rmq-publisher.service';
import { OrderReminderEvent } from '../../domain/events/order-reminder.event';

@Controller()
@UseFilters(RabbitMQConsumerErrorFilter)
export class OrdersRabbitMQController {
  private readonly logger = new Logger(OrdersRabbitMQController.name);

  constructor(private readonly rmqService: RmqPublisherService) {}

  // @RabbitSubscribe({
  //   exchange: 'direct.delayed', // O exchange de onde a mensagem virá
  //   queue: 'delayed.queue',
  //   routingKey: 'order.created', // A routingKey específica para este consumidor
  // })
  // handleRemain(message: any) {
  //   this.logger.log(
  //     `Received delayed email message: ${JSON.stringify(message)}`,
  //   );
  //   console.log('Passei no delayed');
  // }

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    queue: 'orders-queue',
    routingKey: 'order.created',
    allowNonJsonMessages: true, // permite que eu receba as mensagens unacked
    queueOptions: {
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'order.created',
    },
  })
  handle(message: any) {
    this.rmqService.publish(
      new OrderReminderEvent({
        orderId: message.id,
        customerId: message.customerId,
        email: 'customerEmail',
      }),
      { withDelay: { delay: 10 * 1000 } },
    );
  }

  // @RabbitSubscribe({
  //   exchange: 'direct.delayed',
  //   routingKey: 'order.created',
  //   queue: 'delayed.queue',
  //   queueOptions: {
  //     deadLetterExchange: 'dlx.exchange',
  //     deadLetterRoutingKey: 'order.created', // TODO: trocar para order_remain
  //   },
  // })
  // async handleDelayedMessages(message: any) {
  //   this.logger.error('Cai no delayed error consumer');
  //   throw new FakeError('Delayed error consumer');
  // }

  // @RabbitSubscribe({
  //   exchange: 'orders-topic-exchange',
  //   queue: 'emails-queue',
  //   routingKey: 'order.created',
  //   allowNonJsonMessages: true, // permite que eu receba as mensagens unacked
  //   queueOptions: {
  //     deadLetterExchange: 'dlx.exchange',
  //     deadLetterRoutingKey: 'order.created',
  //     // messageTtl: 5000 - tempo de vida da mensagem na fila para ser republicada
  //   },
  // })
  // handleEmail(message: any) {
  //   // o RabbitMQConsumerFilter so ativa quando enviamos erros retryables que defini no filtro
  //   // Usar para cenarios em que eu tenho processamento CRUD dos dados que vierem, e ativar o ZodValidator
  //   // Aqui pode ser ZodValidator... VadlidationExceptions e outros
  //   // throw new BadRequestException('Simulando erro');
  // }
}

class FakeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FakeError';
  }
}
