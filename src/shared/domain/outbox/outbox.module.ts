// src/outbox-relay/outbox-relay.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OutboxRelayService } from './outbox-relay.service';
import { KafkaProducerService } from './kafka-producer.service';
import {
  OutboxEntity,
  OutboxSchema,
} from '@/src/modules/order/application/mongo/documents/outbox.document';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OutboxEntity.name, schema: OutboxSchema },
    ]),
  ],
  providers: [OutboxRelayService, KafkaProducerService],
})
export class OutboxRelayModule {}
