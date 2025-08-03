import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class OrdersRabbitMQService {
  constructor(private readonly amqp: AmqpConnection) {}

  async publish(data: any) {
    await this.amqp.publish('orders-topic-exchange', 'order.created', data);
    console.log('Mensagem publicada!');
  }
}
