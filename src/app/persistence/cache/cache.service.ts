import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { Cache } from '@nestjs/cache-manager';

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
    const raw = await this.cache.get(key);
    if (raw == null) {
      this.logger.log('Sem dados no cache');
      return null;
    }

    this.logger.log(`Valor bruto do cache:`, raw);

    let parsed: any;
    if (typeof raw === 'string') {
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        this.logger.warn(
          `Failed to parse cache value for key: ${key}. Error: ${err.message}`,
        );
        return null; // não dá pra usar o dado corrompido
      }
    } else {
      parsed = raw; // já é objeto
    }

    const hydrated = this.rehydrateDates(parsed);
    return hydrated as T;
  }

  // async set<T>(key: string, value: T, ttl?: number): Promise<void> {
  //   try {
  //     // normaliza e armazena sempre como string JSON para comportamento consistente
  //     const payload = JSON.stringify(value);
  //     await this.cache.set(key, payload, ttl);
  //     this.logger.log('Inseri os dados no cache');
  //   } catch (error) {
  //     this.logger.error(`Failed to set cache for key: ${key}`, error.stack);
  //     throw new InternalServerErrorException('Failed to store data in cache.');
  //   }
  // }
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const payload = JSON.stringify(value);
      // cacheable/Keyv espera número (ms), não string tipo "60s"
      await this.cache.set(key, payload, ttl ? ttl * 1000 : undefined);
      this.logger.log(`[CacheService] Inseri os dados no cache: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to set cache for key: ${key}`, error.stack);
      throw new InternalServerErrorException('Failed to store data in cache.');
    }
  }

  /**
   * Re-hidrata objetos convertendo strings ISO-8601 em Date.
   * Regras:
   *  - Se um valor for string e casar com ISO-8601 -> new Date(...)
   *  - Continuação recursiva para arrays/objetos
   */
  private rehydrateDates(obj: any): any {
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

    if (obj == null) return obj; // <- evita erro com null/undefined

    if (Array.isArray(obj)) {
      return obj.map((item) => this.rehydrateDates(item));
    }

    if (typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (typeof value === 'string' && isoRegex.test(value)) {
          obj[key] = new Date(value);
        } else if (typeof value === 'object' && value !== null) {
          obj[key] = this.rehydrateDates(value);
        }
      }
      return obj;
    }

    return obj;
  }

  async delete(key: string): Promise<void> {
    try {
      const result = await this.cache.delete(key);
      this.logger.debug(`[CacheService] Resultado delete: ${result}`);
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
