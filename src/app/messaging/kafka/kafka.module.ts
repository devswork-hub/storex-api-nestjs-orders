// src/kafka/kafka.module.ts
import { Module } from '@nestjs/common';
import {
  ClientsModule,
  Transport,
  ClientProviderOptions,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { KafkaConsumer } from './kafka.consumer';
import { ConfigValues } from '../../config/config.values';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        inject: [ConfigValues],
        useFactory: (cfg: ConfigValues): ClientProviderOptions => ({
          name: 'KAFKA_SERVICE',
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: cfg.get('KAFKA_BROKERS').split(','),
            },
            consumer: {
              groupId: cfg.get('KAFKA_CONSUMER_GROUP'),
            },
          },
        }),
      },
    ]),
  ],
  controllers: [KafkaConsumer],
})
export class KafkaModule {}
