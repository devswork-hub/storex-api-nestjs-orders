import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { ConfigModule } from './config/config.module';
import { PersistenceModule } from './persistence/persistence.module';
import { DomainsModule } from '../modules/domain-modules.module';
import { CustomCacheModule } from './persistence/cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './persistence/postgres/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    PersistenceModule.register({ type: 'mongoose', global: true }),
    CustomCacheModule.forRoot({ isGlobal: true }),
    DomainsModule,
  ],
})
export class AppModule {}
