import 'dotenv/config';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { typeormEnties } from './entities';
import * as path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  entities: [...typeormEnties],
  // entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [path.resolve(__dirname, '../../../**/*.migration.{ts,js}')],
  migrationsTableName: 'migrations',
  migrationsRun: false,
  // schema: configService.get<string>('DB_SCHEMA'),
  synchronize: false,
  logging: ['error', 'warn', 'schema'],
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    connectionLimit: 10,
  },
});

// @ManyToMany(() => Team, (team) => team.members, {
//     nullable: true,
//     eager: false, // Don't automatically load teams with every user query
//     cascade: false, // Prevent cascading operations to teams
//   })
