import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { ConfigModule } from './config/config.module';
import { PersistenceModule } from './persistence/persistence.module';
import { DomainsModule } from '../modules/domain-modules.module';
import { CustomCacheModule } from './persistence/cache/cache.module';
import { TypeORMModule } from './persistence/typeorm/typeorm.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true,
    }),
    TypeORMModule,
    PersistenceModule.register({ type: 'mongoose', global: true }),
    CustomCacheModule.forRoot({ isGlobal: true }),
    DomainsModule,
  ],
})
export class AppModule {}
