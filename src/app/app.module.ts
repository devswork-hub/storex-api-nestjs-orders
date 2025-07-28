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
import { RabbitmqModule } from './messaging/rabbitmq/rabbitmq.module';
import { KafkaModule } from './messaging/kafka/kafka.module';
import { ConfigValues } from './config/config.values';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
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
    RabbitmqModule,
    KafkaModule,
    DomainsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
