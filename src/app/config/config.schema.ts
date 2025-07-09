import { z } from 'zod';

export const ConfigSchema = z.object({
  // App
  APP_PORT: z.string().nonempty({ message: 'Pass APP_PORT key' }),

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

  // Redis
  REDIS_URI: z.string().optional().nullable(),
  REDIS_PORT: z.string().optional().nullable(),
  REDIS_HOST: z.string().optional().nullable(),
  REDIS_USER: z.string().optional().nullable(),
  REDIS_PASSWORD: z.string().optional().nullable(),
});
