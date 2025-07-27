import { Global, Module } from '@nestjs/common';
import {
  ClientsModule,
  Transport,
  ClientProviderOptions,
  ClientProxy,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
// import { RabbitConsumer } from './rabbitmq.consumer';
import { ConfigModule } from '../../config/config.module';
// import { RabbitMQConfigService } from './rabbitmq.config.service';
// import { RabbitMQPublisher } from './rabbitmq.publisher';

export const RABBIT_ORDERS_SERVICE = Symbol('RABBIT_ORDERS_SERVICE');
export const RABBIT_PAYMENTS_SERVICE = Symbol('RABBIT_PAYMENTS_SERVICE');

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
            queueOptions: {
              durable: false,
              // TODO: nao funciona assim
              // deadLetterExchange: 'dlx-orders-exchange',
              // deadLetterRoutingKey: 'dlx-orders-key',
            }, // Se quiser que a fila persista mesmo se o RabbitMQ reiniciar 'true'
          },
        }),
      },
      {
        name: RABBIT_PAYMENTS_SERVICE, // É o identificador do provider no NestJS DI container
        inject: [ConfigService],
        useFactory: (cfg: ConfigService): ClientProviderOptions => ({
          name: RABBIT_PAYMENTS_SERVICE, // 	É o identificador que o Nest usa internamente pro ClientProxy
          transport: Transport.RMQ,
          options: {
            urls: [cfg.get<string>('RABBITMQ_URL')],
            queue: 'order_payments',
            queueOptions: { durable: false }, // Se quiser que a fila persista mesmo se o RabbitMQ reiniciar 'true'
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule],
  // controllers: [RabbitConsumer, RabbitMQConfigService, RabbitMQPublisher],
  // controllers: [RabbitConsumer, RabbitMQPublisher],
  // providers: [RabbitMQPublisher],
})
export class RabbitmqModule {}
