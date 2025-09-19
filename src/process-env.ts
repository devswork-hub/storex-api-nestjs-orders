// WIP: Utilitario em desenvolvimento

export const isProd = process.env.NODE_ENV === 'production';
export const enablePostgresSeed = process.env.PG_ENABLE_SEED === 'true';
export const enableMongoSeed = process.env.MONGO_ENABLE_SEED === 'true';
