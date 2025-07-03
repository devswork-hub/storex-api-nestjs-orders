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
}
