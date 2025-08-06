import { Global, Module } from '@nestjs/common';
import { RabbitMQModule as GoLevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RmqPublisherService } from './rmq-publisher.service';
import { InMemoryBroker } from './in-memory-broker';

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
          exchange: 'orders-topic-exchange',
        },
        {
          name: 'emails-queue',
          options: { durable: true },
          routingKey: ['order.created'],
          exchange: 'orders-topic-exchange',
        },
      ],
      enableControllerDiscovery: true, // permite usar @RabbitSubscribe
    }),
  ],
  providers: [
    RmqPublisherService,
    { provide: 'MessageBrokerContract', useClass: InMemoryBroker },
  ],
  exports: [
    GoLevelupRabbitMQModule,
    RmqPublisherService,
    'MessageBrokerContract',
  ],
})
export class RabbitmqWrapperModule {}
