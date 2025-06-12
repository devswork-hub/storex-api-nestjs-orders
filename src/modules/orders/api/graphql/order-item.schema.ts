import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

/**
 * Representa um item de um pedido, tanto no MongoDB (via Mongoose) quanto na API GraphQL.
 */
@Schema({ timestamps: true })
@ObjectType('OrderItem') // Define o nome no schema GraphQL, pode ser útil se quiser renomear ali
export class OrderItem {
  @Field(() => ID)
  _id: string;

  @Prop({ required: [true, 'Product ID is required'] })
  @Field(() => String)
  productId: string;

  @Prop({ required: true, min: 0 })
  @Field(() => Float)
  quantity: number;

  @Prop({ required: true, min: 0 })
  @Field(() => Float)
  unitPrice: number;
}

// Define o tipo do documento Mongoose (com métodos, etc.)
export type OrderItemDocument = HydratedDocument<OrderItem>;

// Gera o schema Mongoose com base na classe decorada
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
