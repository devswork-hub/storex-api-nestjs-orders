import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'email-queue',
      queueOptions: {
        durable: true,
      },
      exchange: 'orders-topic-exchange',
      exchangeType: 'topic',
      routingKey: 'order.created',
    },
  });

  await app.startAllMicroservices();
  await app.listen(4001);
}
bootstrap();
