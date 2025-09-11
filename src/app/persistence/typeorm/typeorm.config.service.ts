import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigValues } from '../../config/config.values';
import { AppDataSource } from './typeorm-datasource';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigValues) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return { ...AppDataSource.options };
  }

  getConfig(): TypeOrmModuleOptions {
    return this.createTypeOrmOptions();
  }
}
