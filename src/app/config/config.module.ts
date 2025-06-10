import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigModuleOptions as NestConfigModuleOptions,
} from '@nestjs/config';
import { join } from 'path';

@Module({})
export class ConfigModule extends NestConfigModule {
  static forRoot(options?: NestConfigModuleOptions) {
    const envFilePaths = [
      join(process.cwd(), `.env.${process.env.NODE_ENV}`),
      join(process.cwd(), `.env`),
    ];

    return super.forRoot({
      isGlobal: true,
      envFilePath: envFilePaths,
      ...options,
    });
  }
}
