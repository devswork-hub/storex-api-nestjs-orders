import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderItemContract } from '../../../domain/order-item';
import { ChangeTo } from '@/src/app/utils/type';
import { MoneyOutput } from '../outputs/money.output';
import { DiscountOutput } from '../outputs/discount.output';

/**
 * Representa um item de um pedido, tanto no MongoDB (via Mongoose) quanto na API GraphQL.
 */
@Schema({ timestamps: true })
@ObjectType(OrderItem.name) // Define o nome no schema GraphQL, pode ser útil se quiser renomear ali
export class OrderItem
  implements
    ChangeTo<
      OrderItemContract,
      {
        price: MoneyOutput;
        discount: DiscountOutput;
      }
    >
{
  @Prop({ required: [true, '"productId" is required'] })
  productId: string;

  @Prop({ required: [true, '"quantity" is required'] })
  quantity: number;

  @Prop({ required: [true, '"price" is required'] })
  price: MoneyOutput;

  @Prop()
  discount?: DiscountOutput;

  @Prop()
  seller?: string;

  @Prop()
  title?: string;

  @Prop()
  imageUrl?: string;

  @Prop()
  description?: string;

  @Prop()
  shippingId?: string;

  @Prop()
  id?: string;

  @Prop()
  active?: boolean;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop()
  deleted?: boolean;

  @Prop()
  deletedAt?: Date;
}

// Define o tipo do documento Mongoose (com métodos, etc.)
export type OrderItemDocument = HydratedDocument<OrderItem>;

// Gera o schema Mongoose com base na classe decorada
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
