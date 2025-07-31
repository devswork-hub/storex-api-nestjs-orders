import { Module } from '@nestjs/common';
import {
  ClientsModule,
  Transport,
  ClientProviderOptions,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '../../config/config.module';
import { RabbitMQSetupService } from './rabbitmq.setup.service';
// import { RabbitConsumer } from './rabbitmq.consumer';
// import { RabbitMQConfigService } from './rabbitmq.config.service';
// import { RabbitMQPublisher } from './rabbitmq.publisher';

export const RABBIT_ORDERS_SERVICE = Symbol('RABBIT_ORDERS_SERVICE');
export const RABBIT_PAYMENTS_SERVICE = Symbol('RABBIT_PAYMENTS_SERVICE');
export const RMQ_TASKS_SERVICE = Symbol('RMQ_TASKS_SERVICE');

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: RABBIT_ORDERS_SERVICE, // É o identificador do provider no NestJS DI container
        inject: [ConfigService],
        useFactory: (cfg: ConfigService): ClientProviderOptions => ({
          name: RABBIT_ORDERS_SERVICE, // 	É o identificador que o Nest usa internamente pro ClientProxy
          transport: Transport.RMQ,
          options: {
            urls: [cfg.get<string>('RABBITMQ_URL')],
            queue: cfg.get<string>('RABBITMQ_QUEUE_ORDER'),
            exchange: 'orders-exchange',
            exchangeType: 'direct',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
  // providers: [RabbitMQSetupService],
  // controllers: [RabbitConsumer, RabbitMQConfigService, RabbitMQPublisher],
  // controllers: [RabbitConsumer, RabbitMQPublisher],
  // providers: [RabbitMQPublisher],
})
export class RabbitmqModule {}
