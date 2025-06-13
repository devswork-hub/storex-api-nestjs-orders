import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => {
        const user = process.env.MONGODB_USER || 'user';
        const password = process.env.MONGODB_PASS || 'password';
        const host = process.env.MONGODB_HOST || 'localhost';
        const port = process.env.MONGODB_PORT || '27017';
        const dbName = process.env.MONGODB_DB_NAME || 'mydatabase';

        return {
          uri: `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin`,
          ssl: false, // true se for Atlas ou conexão segura
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
