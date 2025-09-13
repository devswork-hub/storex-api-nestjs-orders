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
    const raw = await this.cache.get<any>(key);
    if (raw == null) return null;

    let parsed: any = raw;

    // Se veio como string, tente parsear JSON (padrão quando armazenamos como string)
    if (typeof raw === 'string') {
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        this.logger.warn(
          `Failed to parse cache value for key: ${key}. Error: ${err.message}`,
        );
        parsed = raw;
      }
    }

    // Re-hidrata datas (recursivo)
    const hydrated = this.rehydrateDates(parsed);
    return hydrated as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      // normaliza e armazena sempre como string JSON para comportamento consistente
      const payload = JSON.stringify(value);
      await this.cache.set(key, payload, ttl ? `${ttl}s` : undefined);
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

    if (obj === null || obj === undefined) return obj;

    if (Array.isArray(obj)) {
      return obj.map((item) => this.rehydrateDates(item));
    }

    if (typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
        const value = obj[key];

        if (typeof value === 'string' && isoRegex.test(value)) {
          // converte strings ISO em Date
          const d = new Date(value);
          obj[key] = isNaN(d.getTime()) ? value : d;
        } else if (typeof value === 'object') {
          obj[key] = this.rehydrateDates(value);
        }
        // opcional: forçar campos que terminem com "At" caso estejam em outro formato
        else if (
          (key.toLowerCase().endsWith('at') ||
            key.toLowerCase().includes('date')) &&
          typeof value === 'string'
        ) {
          const d = new Date(value);
          obj[key] = isNaN(d.getTime()) ? value : d;
        }
      }
      return obj;
    }

    return obj;
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
