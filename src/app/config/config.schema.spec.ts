import { ConfigSchema } from './config.schema';

describe('ConfigSchema', () => {
  it('valida configuração válida', () => {
    const validConfig = {
      APP_PORT: '3000',
      NODE_ENV: 'development',
      CACHE_DEFAULT_TTL: '60',
      MONGODB_USER: 'user',
      MONGODB_PASS: 'pass',
      MONGODB_HOST: 'localhost',
      MONGODB_PORT: '27017',
      MONGODB_DB: 'test',
      PG_USERNAME: 'pguser',
      PG_PASSWORD: 'pgpass',
      PG_NAME: 'pgdb',
      PG_HOST: 'localhost',
      PG_PORT: '5432',
      PG_SEEDER: 'true',
      PG_SYNCRONIZE: 'false',
      PG_DB: 'postgres',
      RABBITMQ_URL: 'amqp://localhost',
      RABBITMQ_QUEUE_ORDER: 'orders',
      KAFKA_BROKERS: 'broker1',
      KAFKA_CONSUMER_GROUP: 'group1',
      BULLMQ_HOST: 'localhost',
      BULLMQ_PORT: '6379',
    };

    expect(() => ConfigSchema.parse(validConfig)).not.toThrow();
  });

  it('falha se APP_PORT estiver ausente', () => {
    const invalidConfig = {
      NODE_ENV: 'development',
    };
    expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
  });

  it('falha se MONGODB_PORT não for número', () => {
    const invalidConfig = {
      ...ConfigSchema.shape,
      MONGODB_PORT: 'abc',
    };
    expect(() => ConfigSchema.parse(invalidConfig)).toThrow(
      /MONGODB_PORT must be a valid number/,
    );
  });
});
