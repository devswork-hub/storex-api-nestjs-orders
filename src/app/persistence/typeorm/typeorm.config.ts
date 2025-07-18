import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { SeederOptions } from 'typeorm-extension';
import { typeormEnties } from './entities';

export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  username: 'postgres',
  password: 'password',
  database: 'test',
  port: 5432,
  host: 'localhost',
  entities: [...typeormEnties],
  migrations: ['src/**/**/migrations/*.ts'],
  seeds: ['src/**/**/seeds/*.ts'],
  factories: ['src/**/**/factories/**/*.ts'],
  seedTracking: false,
  synchronize: process.env.NODE_ENV === 'production' ? false : true,
  logging: process.env.NODE_ENV === 'development',
  namingStrategy: new SnakeNamingStrategy(),
  cache: true,
};
