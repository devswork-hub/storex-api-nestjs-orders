import { z } from 'zod';

export const ConfigSchema = z.object({
  MONGODB_USER: z.string().nonempty({ message: 'Pass MONGO_USER key ' }),
  MONGODB_PASS: z.string().nonempty({ message: 'Pass MONGODB_PASS key ' }),
  MONGODB_HOST: z.string().nonempty({ message: 'Pass MONGODB_HOST key ' }),
  MONGODB_PORT: z.number({ required_error: 'Pass MONGODB_PORT' }),
  MONGODB_DB: z.string().nonempty({ message: 'Pass MONGODB_DB key ' }),
});
