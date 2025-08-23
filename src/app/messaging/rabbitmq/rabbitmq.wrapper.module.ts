import { Global, Module } from '@nestjs/common';
import { RabbitMQModule as GoLevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RmqPublisherService } from './rmq-publisher.service';
import { InMemoryBroker } from './in-memory-broker';
import { RabbitMQConsumerErrorFilter } from './rabbitmq-consumer-error.filter';

@Global()
@Module({
  imports: [
    GoLevelupRabbitMQModule.forRoot({
      uri: 'amqp://admin:admin@localhost:5672',
      exchanges: [
        { name: 'dlx.exchange', type: 'topic' },
        {
          name: 'direct.delayed',
          type: 'x-delayed-message',
          options: {
            arguments: {
              'x-delayed-type': 'direct',
            },
          },
        },
        { name: 'orders-topic-exchange', type: 'topic' },
      ],
      queues: [
        {
          name: 'delayed.queue',
          exchange: 'direct.delayed',
          options: {
            arguments: {
              'x-dead-letter-exchange': 'dlx.exchange',
              'x-dead-letter-routing-key': 'order.created',
            },
          },
        },
        {
          name: 'dlx.queue',
          exchange: 'dlx.exchange',
          routingKey: '#', // aceito qualquer routing key
        },
        {
          name: 'orders-queue',
          options: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'dlx.exchange',
              'x-dead-letter-routing-key': 'order.created',
            },
          },
          routingKey: ['order.created'],
          exchange: 'orders-topic-exchange',
        },
        {
          name: 'emails-queue',
          options: {
            durable: true,
            arguments: {
              'x-dead-letter-exchange': 'dlx.exchange',
              'x-dead-letter-routing-key': 'order.created',
            },
          },
          routingKey: ['order.created'],
          exchange: 'orders-topic-exchange',
        },
        // {
        //   name: 'orders-queue',
        //   exchange: 'direct.delayed',
        //   routingKey: 'order.created',
        // },
      ],
      enableControllerDiscovery: true, // permite usar @RabbitSubscribe
    }),
  ],
  providers: [
    RabbitMQConsumerErrorFilter,
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
