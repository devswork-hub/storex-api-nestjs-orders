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
    queueOptions: {
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'order.created',
    },
  })
  handle(message: any) {
    console.log(`Receive message`);
  }

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    queue: 'emails-queue',
    routingKey: 'order.created',
    allowNonJsonMessages: true, // permite que eu receba as mensagens unacked
    queueOptions: {
      deadLetterExchange: 'dlx.exchange',
      deadLetterRoutingKey: 'order.created',
      // messageTtl: 5000 - tempo de vida da mensagem na fila para ser republicada
    },
  })
  handleEmail(message: any) {
    // o RabbitMQConsumerFilter so ativa quando enviamos erros retryables que defini no filtro
    // Usar para cenarios em que eu tenho processamento CRUD dos dados que vierem, e ativar o ZodValidator
    // Aqui pode ser ZodValidator... VadlidationExceptions e outros
    throw new BadRequestException('Simulando erro');
  }
}
