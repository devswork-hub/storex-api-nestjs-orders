import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigValues } from '../config/config.values';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigValues],
      useFactory: (config: ConfigValues) => {
        const user = config.get('MONGODB_USER') || 'user';
        const password = config.get('MONGODB_PASS') || 'password';
        const host = config.get('MONGODB_HOST') || 'localhost';
        const port = config.get('MONGODB_PORT') || '27017';
        const dbName = config.get('MONGODB_DB') || 'orders';

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

// TODO: ajustar para o replicaset funcionar
// @Module({
//   imports: [
//     MongooseModule.forRootAsync({
//       inject: [ConfigValues],
//       useFactory: (config: ConfigValues) => {
//         const user = config.get('MONGODB_USER') || 'user';
//         const password = config.get('MONGODB_PASS') || 'password';
//         const host = config.get('MONGODB_HOST') || 'localhost';
//         const port = config.get('MONGODB_PORT') || '27017';
//         const dbName = config.get('MONGODB_DB') || 'orders';
//         const replicaSet = config.get('MONGODB_REPLICA_SET') || undefined;

//         console.log(
//           MongooseAppModule.name,
//           ` ===> mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin&${replicaSet && `replicaSet=${replicaSet}`}`,
//         );
//         return {
//           uri: `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=admin&${replicaSet && `replicaSet=${replicaSet}`}`,
//           ssl: false, // true se for Atlas ou conexão segura
//           connectionFactory: (connection) => {
//             if (connection.readyState === 1) {
//               console.log(`Connected to database ${dbName} at ${host}:${port}`);
//             }
//             return connection;
//           },
//         };
//       },
//     }),
//   ],
// })
// export class MongooseAppModule {}
