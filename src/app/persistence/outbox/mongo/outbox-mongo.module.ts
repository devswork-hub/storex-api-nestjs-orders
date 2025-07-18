import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OutboxMongoEntity, OutboxMongoSchema } from './outbox-mongo.entity';
import { OutboxMongoService } from './outbox-mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OutboxMongoEntity.name, schema: OutboxMongoSchema },
    ]),
  ],
  providers: [OutboxMongoService],
  exports: [OutboxMongoService],
})
export class OutboxMongoModule {}
