import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from './config/config.module';
import { PersistenceModule } from './persistence/persistence.module';
import { DomainsModule } from '../modules/domain-modules.module';
import { CustomCacheModule } from './persistence/cache/cache.module';
import { TypeORMModule } from './persistence/typeorm/typeorm.module';
import { ScheduleModule } from '@nestjs/schedule';
import { KafkaModule } from './messaging/kafka/kafka.module';
import { ConfigValues } from './config/config.values';
import { BullModule } from '@nestjs/bullmq';
import { RabbitmqWrapperModule } from './messaging/rabbitmq/rabbitmq.wrapper.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigValues],
      useFactory: (cfg: ConfigValues) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        introspection: cfg.get('NODE_ENV') === 'development',
        playground: cfg.get('NODE_ENV') === 'development',
      }),
    }),
    TypeORMModule,
    PersistenceModule.register({ type: 'mongoose', global: true }),
    CustomCacheModule.forRoot({ isGlobal: true }),
    DomainsModule,
    KafkaModule,
    RabbitmqWrapperModule,
  ],
})
export class AppModule {}
