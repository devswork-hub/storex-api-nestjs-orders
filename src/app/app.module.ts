import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';
import { ConfigModule } from './config/config.module';
import { PersistenceModule } from './persistence/persistence.module';
import { DomainsModule } from '../modules/domain-modules.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';
import { randomUUID } from 'crypto';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // CacheModule.register({
    //   cacheId: `test-${randomUUID()}`,
    // }),
    // CacheModule.registerAsync({
    //   useFactory: async () => {
    //     return {
    //       stores: [
    //         new Keyv({
    //           store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
    //         }),
    //         createKeyv('redis://localhost:6379'),
    //       ],
    //     };
    //   },
    // }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true,
    }),
    PersistenceModule,
    DomainsModule,
  ],
})
export class AppModule {}
