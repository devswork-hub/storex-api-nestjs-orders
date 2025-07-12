import {
  OutboxDocument,
  OutboxEntity,
} from '@/src/modules/order/application/mongo/documents/outbox.document';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class OutboxRepository {
  constructor(
    @InjectModel(OutboxEntity.name)
    private outbox: Model<OutboxDocument>,
  ) {}

  // TODO: aplicar tipo generico para melhorar a tipagem
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
