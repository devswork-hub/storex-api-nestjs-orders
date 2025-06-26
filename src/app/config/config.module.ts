// config.module.ts
import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions,
} from '@nestjs/config';
import { join } from 'path';
import { ConfigSchema } from './config.schema';
import { ZodValidator } from '@/src/shared/domain/validation/zod-validator';

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options?: ConfigModuleOptions) {
    const envFilePaths = [
      join(process.cwd(), `.env.${process.env.NODE_ENV}`),
      join(process.cwd(), `.env`),
    ];

    return super.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths,
      validate: (config) => new ZodValidator(ConfigSchema).validate(config),
      ...options,
    });
  }
}
