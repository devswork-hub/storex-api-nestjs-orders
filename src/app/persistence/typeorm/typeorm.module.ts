import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { typeormEnties } from './entities';
import { ConfigValues } from '../../config/config.values';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigValues],
      useFactory: (config: ConfigValues) => {
        return {
          type: 'postgres',
          host: config.get('PG_HOST'),
          port: Number(config.get('PG_PORT')),
          username: config.get('PG_USERNAME'),
          password: config.get('PG_PASSWORD'),
          database: config.get('PG_DB'),
          entities: [...typeormEnties],
          migrations: ['src/**/**/migrations/*.ts'],
          seeds: ['src/**/**/seeds/*.ts'],
          factories: ['src/**/**/factories/**/*.ts'],
          seedTracking: false,
          synchronize: config.get('NODE_ENV') !== 'production',
          // logging: config.get('NODE_ENV') === 'development',
          logging: ['error', 'warn', 'schema'],
          namingStrategy: new SnakeNamingStrategy(),
          cache: true,
        };
      },
    }),
  ],
})
export class TypeORMModule {}
