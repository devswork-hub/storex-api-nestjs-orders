import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OutboxContract } from '../outbox.contract';

export type OutboxDocument = HydratedDocument<OutboxMongoEntity>;

@Schema({ timestamps: true })
export class OutboxMongoEntity implements OutboxContract<any> {
  @Prop({ required: true })
  aggregateType: string; // Tipo da entidade que gerou o evento (ex: 'Order')

  @Prop({ required: true })
  aggregateId: string; // ID da entidade que gerou o evento (ex: ID do pedido)

  @Prop({ required: true })
  eventType: string; // Tipo do evento (ex: 'OrderCreated', 'OrderUpdated')

  @Prop({ type: Object, required: true })
  payload: Record<string, any>; // Dados do evento

  @Prop({ default: false })
  processed: boolean; // Indica se a mensagem foi processada e enviada

  @Prop()
  processedAt: Date; // Data/hora do processamento
}

export const OutboxMongoSchema =
  SchemaFactory.createForClass(OutboxMongoEntity);
