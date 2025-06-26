import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions as NestConfigModuleOptions,
} from '@nestjs/config';
import { join } from 'path';
import { z, ZodSchema } from 'zod';
import { ConfigSchema } from './config.schema';
import { ZodValidator } from '@/src/shared/domain/validation/zod-validator';

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options?: NestConfigModuleOptions) {
    const envFilePaths = [
      join(process.cwd(), `.env.${process.env.NODE_ENV}`),
      join(process.cwd(), `.env`),
    ];

    return super.forRoot({
      isGlobal: true,
      // validationSchema: new ZodValidator(ConfigSchema).validate(ConfigSchema),
      envFilePath: envFilePaths,
      ...options,
    });
  }
}
