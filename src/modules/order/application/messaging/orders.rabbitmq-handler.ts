import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class OrdersRabbitMQController {
  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    queue: 'orders-queue',
    routingKey: 'order.created',
    allowNonJsonMessages: true, // permite que eu receba as mensagens unacked
  })
  handle(message: any) {
    console.log(`Receive message ${JSON.stringify(message, null, 2)}`);
  }

  @RabbitSubscribe({
    exchange: 'orders-topic-exchange',
    queue: 'emails-queue',
    routingKey: 'order.created',
  })
  handleEmail(message: any) {
    console.log('Emails Queue received:', message);
  }
}
