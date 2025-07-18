// // src/outbox-relay/outbox-relay.module.ts
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { OutboxRelayService } from './outbox-relay.service';
// import { KafkaProducerService } from './kafka-producer.service';
// import {
//   OutboxEntity,
//   OutboxSchema,
// } from '@/src/modules/order/application/mongo/documents/outbox.document';
// import { OutboxRepository } from './outbox-repository';
// import { databaseProviders } from '../postgres/database.providers';
// import { outboxProviders } from './outbox-typeorm.provider';
// import { OutboxTypeORMRepository } from './outbox.typeorm-repository';
// import { OutboxTypeORMEntity } from './outbox-typeorm.entity';

import { Module } from '@nestjs/common';
import { OutboxMongoModule } from './mongo/outbox-mongo.module';
import { OutboxTypeORMModule } from './typeorm/typeorm-outbox.module';

// @Module({
//   // imports: [
//   //   MongooseModule.forFeature([
//   //     { name: OutboxEntity.name, schema: OutboxSchema },
//   //   ]),
//   // ],

//   providers: [
//     ,
//     // OutboxRelayService,
//     // KafkaProducerService,
//     // OutboxRepository,
//     ...databaseProviders,
//     ...outboxProviders,
//   ],
//   // exports: [MongooseModule, OutboxRepository, ...databaseProviders],
//   exports: [...databaseProviders, OutboxTypeORMRepository],
// })
// export class OutboxRelayModule {}

type OutboxProps = {
  provider: 'mongoose' | 'typeorm';
};

function moduleResolver(type: OutboxProps['provider']) {
  const module: Record<OutboxProps['provider'], any> = {
    mongoose: OutboxMongoModule,
    typeorm: OutboxTypeORMModule,
  };
  return module[type];
}

@Module({})
export class OutboxModule {
  static async register({ provider }: OutboxProps) {
    return {
      module: OutboxModule,
      imports: [moduleResolver(provider)],
      exports: [moduleResolver(provider)],
    };
  }
}
