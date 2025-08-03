import { Global, Module } from '@nestjs/common';
import { RabbitMQModule as GoLevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RmqPublisherService } from './rmq-publisher.service';

@Global()
@Module({
  imports: [
    GoLevelupRabbitMQModule.forRoot({
      uri: 'amqp://guest:guest@localhost:5672',
      exchanges: [{ name: 'orders-topic-exchange', type: 'topic' }],
      queues: [
        {
          name: 'orders-queue',
          options: { durable: true },
          routingKey: ['order.created'],
        },
        {
          name: 'emails-queue',
          options: { durable: true },
          routingKey: ['order.created'],
        },
      ],
      enableControllerDiscovery: true, // permite usar @RabbitSubscribe
    }),
  ],
  providers: [RmqPublisherService],
  exports: [GoLevelupRabbitMQModule, RmqPublisherService],
})
export class RabbitmqWrapperModule {}
