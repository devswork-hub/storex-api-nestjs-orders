import { Module } from '@nestjs/common';
import { createKeyv, Keyv } from '@keyv/redis';
import { Cacheable, CacheableMemory } from 'cacheable';
import { CacheService } from './cache.service';

@Module({
  providers: [
    CacheService,
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const memoryStore = new Keyv({ store: new CacheableMemory() });
        const redis = createKeyv('redis://localhost:6379');
        /**
         * O primary e o secondary, sao conceitos do multi-layered caching
         * primary → É o cache de escrita e leitura prioritária (onde os dados vão ser salvos primeiro e de onde são buscados primeiro).
         * secondary → É um cache de leitura apenas, usado como fallback se o primary falhar.
         */
        return new Cacheable({
          primary: redis, // <- usa Redis como primário
          secondary: memoryStore, // opcional: cache de leitura em memória
          ttl: '4h',
        });
      },
    },
  ],
  exports: [CacheService, 'CACHE_INSTANCE'],
})
export class CacheModule {}
