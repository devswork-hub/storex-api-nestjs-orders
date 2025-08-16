import {
  BadRequestException,
  Controller,
  Injectable,
  Logger,
  UseFilters,
} from '@nestjs/common';
import { Nack, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQConsumerErrorFilter } from '@/app/messaging/rabbitmq/rabbitmq-consumer-error.filter';

@Controller()
@UseFilters(new RabbitMQConsumerErrorFilter())
export class OrdersRabbitMQController {
  private readonly logger = new Logger(OrdersRabbitMQController.name);
  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    queue: 'orders-queue',
    routingKey: 'order.created',
    allowNonJsonMessages: true, // permite que eu receba as mensagens unacked
  })
  handle(message: any) {
    console.log(`Receive message`);
  }

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    queue: 'emails-queue',
    routingKey: 'order.created',
  })
  handleEmail(message: any) {
    try {
      // o RabbitMQConsumerFilter so ativa quando enviamos um BadRequestException
      // Usar para cenarios em que eu tenho processamento CRUD dos dados que vierem, e ativar o ZodValidator
      throw new BadRequestException('Simulando erro');
      console.log('Emails Queue received:');
    } catch (error) {
      if (error instanceof BadRequestException) {
        // → não devolve para a fila, e se houver DLQ configurada, ela vai para lá
        this.logger.error('Enviei pra DLQ');
        throw new Nack(false);
      }
    }
  }
}
