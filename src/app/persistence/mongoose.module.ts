import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigValues } from '../config/config.values';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigValues],
      useFactory: (config: ConfigValues) => {
        const user = config.get('MONGODB_USER');
        const password = config.get('MONGODB_PASS');
        const host = config.get('MONGODB_HOST');
        const port = config.get('MONGODB_PORT');
        const dbName = config.get('MONGODB_DB');

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`,
          ssl: false,
          connectionFactory: (connection) => {
            if (connection.readyState === 1) {
              console.log(`Connected to database ${dbName} at ${host}:${port}`);
            }
            return connection;
          },
        };
      },
    }),
  ],
})
export class MongooseAppModule {}
