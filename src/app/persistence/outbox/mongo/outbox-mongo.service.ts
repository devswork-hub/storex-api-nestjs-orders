import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import { OutboxDocument, OutboxMongoEntity } from './outbox-mongo.entity';

@Injectable()
export class OutboxMongoService {
  constructor(
    @InjectModel(OutboxMongoEntity.name)
    private outbox: Model<OutboxDocument>,
  ) {}

  async save(entity: any, session: ClientSession) {
    const outboxEntity = new this.outbox(entity);
    await outboxEntity.save({ session });
  }

  async findUnprocessedEvents() {
    return this.outbox
      .find({
        processed: false,
      })
      .sort({ createdAt: 1 })
      .exec();
  }

  async markEventAsProcessed(eventId: string) {
    await this.outbox
      .updateOne(
        { _id: eventId },
        { $set: { processed: true, processedAt: new Date() } },
      )
      .exec();
  }
}
