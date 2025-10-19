import { Module, Global, DynamicModule } from '@nestjs/common';
import { CacheService } from './cache.service';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { Cacheable, CacheableMemory } from 'cacheable';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CustomCacheModuleOptions } from './cache.config';
import { ConfigValues } from '../../config/config.values';

@Global()
@Module({})
export class CustomCacheModule {
  static forRoot(options?: CustomCacheModuleOptions): DynamicModule {
    const providers = [
      CacheService,
      {
        provide: 'CACHE_INSTANCE',
        inject: [ConfigValues],
        useFactory: async (cfg: ConfigValues) => {
          const redisUrl =
            options?.redisUrl ?? cfg.get('REDIS_URL') ?? 'redis://cache:6379';

          const redis = new KeyvRedis(redisUrl);
          // redis.on('error', (err) => {
          //   console.error('[Cache] Redis connection error:', err);
          // });

          const memory = new Keyv({ store: new CacheableMemory() });

          // Cria a instância Cacheable (primary e secondary)
          const cacheable = new Cacheable({
            primary: redis,
            secondary: memory,
            ttl: options?.ttl ?? '4h',
          });

          // Teste rápido (opcional)
          try {
            await cacheable.set('cache_connection_test', 'ok', '5s');
            const test = await cacheable.get('cache_connection_test');
            console.log('[Cache] Test connection ok =>', test === 'ok');
          } catch (err) {
            console.error(
              '[Cache] Test connection failed:',
              err?.message ?? err,
            );
          }

          return cacheable;
        },
      },
      // <-- mapeia CACHE_MANAGER para a mesma instância (evita erro de provider)
      {
        provide: CACHE_MANAGER,
        useExisting: 'CACHE_INSTANCE',
      },
    ];

    return {
      module: CustomCacheModule,
      global: options?.isGlobal ?? true,
      providers,
      exports: [CacheService, 'CACHE_INSTANCE', CACHE_MANAGER],
    };
  }
}
