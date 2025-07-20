import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigValues } from '../../config/config.values';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { typeormEnties } from './entities';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private config: ConfigValues) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.config.get('PG_HOST'),
      port: Number(this.config.get('PG_PORT')),
      username: this.config.get('PG_USERNAME'),
      password: this.config.get('PG_PASSWORD'),
      database: this.config.get('PG_DB'),
      entities: [...typeormEnties],
      synchronize: this.config.get('NODE_ENV') !== 'production',
      logging: ['error', 'warn', 'schema'],
      namingStrategy: new SnakeNamingStrategy(),
      cache: true,
    };
  }

  getConfig(): TypeOrmModuleOptions {
    return this.createTypeOrmOptions();
  }
}
