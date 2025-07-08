import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class RabbitMQPublisherService {
  private client: ClientProxy;

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@localhost:5672'], // ajuste para seu ambiente
        queue: 'order_events',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  async publish(pattern: string, payload: any) {
    return this.client.emit(pattern, payload).toPromise();
  }
}
