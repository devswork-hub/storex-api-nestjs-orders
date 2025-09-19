// import { Global, Module } from '@nestjs/common';
// import { RabbitMQModule as GoLevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
// import { RmqPublisherService } from './rmq-publisher.service';
// import { InMemoryBroker } from './in-memory-broker';
// import { RabbitMQConsumerErrorFilter } from './rabbitmq-consumer-error.filter';

// @Global()
// @Module({
//   imports: [
//     GoLevelupRabbitMQModule.forRoot({
//       uri: 'amqp://admin:admin@localhost:5672',
//       registerHandlers: process.env.NODE_ENV !== 'producttion' ? false : true, // standalone mode, sem auto-discovery
//       exchanges: [
//         { name: 'dlx.exchange', type: 'topic' },
//         {
//           name: 'direct.delayed',
//           type: 'x-delayed-message',
//           options: {
//             arguments: {
//               'x-delayed-type': 'direct',
//             },
//           },
//         },
//         { name: 'orders-topic-exchange', type: 'topic' },
//       ],
//       queues: [
//         {
//           name: 'delayed.queue',
//           exchange: 'direct.delayed',
//           options: {
//             arguments: {
//               'x-dead-letter-exchange': 'dlx.exchange',
//               'x-dead-letter-routing-key': 'order.created',
//             },
//           },
//         },
//         {
//           name: 'dlx.queue',
//           exchange: 'dlx.exchange',
//           routingKey: '#', // aceito qualquer routing key
//           createQueueIfNotExists: false,
//         },
//         {
//           name: 'orders-queue',
//           options: {
//             durable: true,
//             arguments: {
//               'x-dead-letter-exchange': 'dlx.exchange',
//               'x-dead-letter-routing-key': 'order.created',
//             },
//           },
//           routingKey: ['order.created'],
//           exchange: 'orders-topic-exchange',
//         },
//         {
//           name: 'emails-queue',
//           options: {
//             durable: true,
//             arguments: {
//               'x-dead-letter-exchange': 'dlx.exchange',
//               'x-dead-letter-routing-key': 'order.created',
//             },
//           },
//           routingKey: ['order.created'],
//           exchange: 'orders-topic-exchange',
//         },
//         // {
//         //   name: 'orders-queue',
//         //   exchange: 'direct.delayed',
//         //   routingKey: 'order.created',
//         // },
//       ],
//       enableControllerDiscovery: true, // permite usar @RabbitSubscribe
//     }),
//   ],
//   providers: [
//     RabbitMQConsumerErrorFilter,
//     RmqPublisherService,
//     { provide: 'MessageBrokerContract', useClass: InMemoryBroker },
//   ],
//   exports: [
//     GoLevelupRabbitMQModule,
//     RmqPublisherService,
//     'MessageBrokerContract',
//   ],
// })
// export class RabbitmqWrapperModule {}

import { DynamicModule, Global, Module } from '@nestjs/common';
import { RabbitMQModule as GoLevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RmqPublisherService } from './rmq-publisher.service';
import { InMemoryBroker } from './in-memory-broker';
import { RabbitMQConsumerErrorFilter } from './rabbitmq-consumer-error.filter';

@Global()
@Module({})
export class RabbitmqWrapperModule {
  static forRoot(options?: { enableHandlers?: boolean }): DynamicModule {
    return {
      module: RabbitmqWrapperModule,
      imports: [
        GoLevelupRabbitMQModule.forRoot({
          uri: 'amqp://admin:admin@localhost:5672',
          connectionInitOptions: { wait: true, timeout: 30000 },
          registerHandlers:
            process.env.NODE_ENV !== 'production'
              ? false
              : (options.enableHandlers ?? true), // standalone mode, sem auto-discovery
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
              routingKey: '#', // aceita qualquer routing key
              // createQueueIfNotExists: false,
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
    };
  }
}
