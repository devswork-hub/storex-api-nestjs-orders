import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cacheable } from 'cacheable';

// Opcional: Criar uma exceção mais específica para problemas de cache
// class CacheServiceException extends InternalServerErrorException {
//   constructor(message: string, cause?: any) {
//     super(`Cache service error: ${message}`);
//     if (cause) {
//       // Você pode adicionar a causa original para depuração
//       // ou logar aqui
//     }
//   }
// }

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name); // É bom ter um logger aqui
  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get<T>(key: string): Promise<T | null> {
    const raw = await this.cache.get<string>(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      await this.cache.set<T>(key, value, ttl ? `${ttl}s` : undefined);
    } catch (error) {
      this.logger.error(`Failed to set cache for key: ${key}`, error.stack);
      throw new InternalServerErrorException('Failed to store data in cache.');
      // throw new CacheServiceException('Failed to store data in cache.', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cache.delete(key);
    } catch (error) {
      this.logger.error(
        `Failed to delete from cache for key: ${key}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to delete data from cache.',
      );
      // throw new CacheServiceException('Failed to delete data from cache.', error);
    }
  }
}
