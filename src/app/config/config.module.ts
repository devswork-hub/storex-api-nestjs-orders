import { DynamicModule, Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';
import { join } from 'path';
import { ConfigSchema } from './config.schema';
import { ZodValidator } from '@/src/shared/domain/validation/zod-validator';
import { ConfigValues } from './config.values';

@Module({})
export class ConfigModule {
  static forRoot(options?: ConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      global: true, // garante que o ConfigService seja visível globalmente
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          envFilePath: [
            join(process.cwd(), `.env.${process.env.NODE_ENV}`),
            join(process.cwd(), `.env`),
          ],
          validate: (config) => new ZodValidator(ConfigSchema).validate(config),
          ...options,
        }),
      ],
      providers: [ConfigValues],
      exports: [ConfigValues],
    };
  }
}
