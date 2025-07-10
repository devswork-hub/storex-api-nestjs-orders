import { OutboxContract } from '@/src/shared/domain/outbox/outbox.contract';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderOuput } from '../../graphql/outputs/order.output';

export type OutboxDocument = HydratedDocument<OutboxEntity>;

@Schema({ timestamps: true })
export class OutboxEntity implements OutboxContract<OrderOuput> {
  @Prop({ required: true })
  aggregateType: string; // Tipo da entidade que gerou o evento (ex: 'Order')

  @Prop({ required: true })
  aggregateId: string; // ID da entidade que gerou o evento (ex: ID do pedido)

  @Prop({ required: true })
  eventType: string; // Tipo do evento (ex: 'OrderCreated', 'OrderUpdated')

  @Prop({ type: Object, required: true })
  payload: Record<string, OrderOuput>; // Dados do evento

  @Prop({ default: false })
  processed: boolean; // Indica se a mensagem foi processada e enviada

  @Prop()
  processedAt: Date; // Data/hora do processamento
}

export const OutboxSchema = SchemaFactory.createForClass(OutboxEntity);
