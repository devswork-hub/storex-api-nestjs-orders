import { z } from 'zod';

export const ConfigSchema = z.object({
  // App
  APP_PORT: z.string().nonempty({ message: 'Pass APP_PORT key' }),
  NODE_ENV: z.enum(['development', 'production']),

  // Cache
  CACHE_DEFAULT_TTL: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'CACHE_DEFAULT_TTL must be a valid number',
    }),

  // MongoDB
  MONGODB_USER: z.string().nonempty({ message: 'Pass MONGO_USER key' }),
  MONGODB_PASS: z.string().nonempty({ message: 'Pass MONGODB_PASS key' }),
  MONGODB_HOST: z.string().nonempty({ message: 'Pass MONGODB_HOST key' }),
  MONGODB_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: 'MONGODB_PORT must be a valid number',
    }),
  MONGODB_DB: z.string().nonempty({ message: 'Pass MONGODB_DB key' }),
  MONGODB_REPLICA_SET: z.string().optional().nullable(),

  // Redis
  REDIS_URI: z.string().optional().nullable(),
  REDIS_PORT: z.string().optional().nullable(),
  REDIS_HOST: z.string().optional().nullable(),
  REDIS_USER: z.string().optional().nullable(),
  REDIS_PASSWORD: z.string().optional().nullable(),

  PG_USERNAME: z.string().nonempty({ message: 'PG_USERNAME is required' }),
  PG_PASSWORD: z.string().nonempty({ message: 'PG_PASSWORD is required' }),
  PG_NAME: z.string().nonempty({ message: 'PG_NAME is required' }),
  PG_HOST: z.string().nonempty({ message: 'PG_HOST is required' }),
  PG_PORT: z.string().nonempty({ message: 'PG_PORT is required' }),
  // TODO: converter para booleano
  PG_SEEDER: z.string().nonempty({ message: 'PG_SEEDER is required' }),
  // TODO: converter para booleano
  PG_SYNCRONIZE: z.string().nonempty({ message: 'PG_SYNCRONIZE is required' }),
  PG_DB: z.string(),
});
