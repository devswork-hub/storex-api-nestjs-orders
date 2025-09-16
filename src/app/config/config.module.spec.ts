import { Test } from '@nestjs/testing';
import { ConfigModule } from './config.module';
import { ConfigValues } from './config.values';

describe('ConfigModule', () => {
  it('deve carregar com configuração válida', async () => {
    process.env.APP_PORT = '3000';
    process.env.NODE_ENV = 'development';
    process.env.CACHE_DEFAULT_TTL = '60';
    process.env.MONGODB_USER = 'user';
    process.env.MONGODB_PASS = 'pass';
    process.env.MONGODB_HOST = 'localhost';
    process.env.MONGODB_PORT = '27017';
    process.env.MONGODB_DB = 'test';
    process.env.PG_USERNAME = 'pguser';
    process.env.PG_PASSWORD = 'pgpass';
    process.env.PG_NAME = 'pgdb';
    process.env.PG_HOST = 'localhost';
    process.env.PG_PORT = '5432';
    process.env.PG_SEEDER = 'true';
    process.env.PG_SYNCRONIZE = 'false';
    process.env.PG_DB = 'postgres';
    process.env.RABBITMQ_URL = 'amqp://localhost';
    process.env.RABBITMQ_QUEUE_ORDER = 'orders';
    process.env.KAFKA_BROKERS = 'broker1';
    process.env.KAFKA_CONSUMER_GROUP = 'group1';
    process.env.BULLMQ_HOST = 'localhost';
    process.env.BULLMQ_PORT = '6379';

    const moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    }).compile();

    const configValues = moduleRef.get(ConfigValues);
    expect(configValues.get('APP_PORT')).toBe('3000');
  });

  it('deve falhar com configuração inválida', async () => {
    process.env.APP_PORT = ''; // inválido

    await expect(
      Test.createTestingModule({
        imports: [ConfigModule.forRoot()],
      }).compile(),
    ).rejects.toThrow(/Validation failed/);
  });
});
