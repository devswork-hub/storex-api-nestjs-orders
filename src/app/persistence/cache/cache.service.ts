import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cacheable } from 'cacheable';

@Injectable()
export class CacheService {
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cache.set<T>(key, value, ttl ? `${ttl}s` : undefined);
  }

  async delete(key: string): Promise<void> {
    await this.cache.delete(key);
  }
}

// @Injectable()
// export class CacheService {
//   private logger = new Logger(CacheService.name);
//   constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

//   async get<T>(key: string): Promise<T | undefined> {
//     try {
//       const result: string | undefined = await this.cacheManager.get<string>(
//         `yourglobalkey::${key}`,
//       );
//       // this.logger.log('Founded data');
//       return result ? JSON.parse(result!) : undefined;
//     } catch (error) {
//       throw new InternalServerErrorException();
//     }
//   }

//   async set(key: string, value: unknown): Promise<void> {
//     try {
//       await this.cacheManager.set(`yourglobalkey::${key}`, value);
//       // this.logger.log('Not found data in cache');
//     } catch (error) {
//       throw new InternalServerErrorException();
//     }
//   }
// }
