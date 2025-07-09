import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from './config.schema';
import { z } from 'zod';

export type ConfigSchemaType = z.infer<typeof ConfigSchema>;

@Injectable()
export class ConfigValues {
  constructor(
    private readonly configService: ConfigService<ConfigSchemaType>,
  ) {}

  get<K extends keyof ConfigSchemaType>(key: K): ConfigSchemaType[K] {
    return this.configService.getOrThrow(key);
  }

  // TODO: validar se isso é útil
  getRedisConnectionUri(): string {
    const uri = this.configService.get('REDIS_URI');
    if (uri) return uri;

    const user = this.configService.get('REDIS_USER');
    const pass = this.configService.get('REDIS_PASSWORD');
    const host = this.configService.get('REDIS_HOST');
    const port = this.configService.get('REDIS_PORT');

    if (!host || !port) {
      throw new Error('Missing REDIS_HOST or REDIS_PORT in env config');
    }

    const auth = user && pass ? `${user}:${pass}@` : '';
    return `redis://${auth}${host}:${port}`;
  }
}
