import { Field, ObjectType } from '@nestjs/graphql';
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
  @Field({ nullable: false })
  productId: string;

  @Prop({ required: [true, '"quantity" is required'] })
  @Field({ nullable: false })
  quantity: number;

  @Prop({ required: [true, '"price" is required'] })
  @Field({ nullable: false })
  price: MoneyOutput;

  @Prop()
  @Field({ nullable: false })
  discount?: DiscountOutput;

  @Prop()
  @Field({ nullable: false })
  seller?: string;

  @Prop()
  @Field({ nullable: false })
  title?: string;

  @Prop()
  @Field({ nullable: false })
  imageUrl?: string;

  @Prop()
  @Field({ nullable: false })
  description?: string;

  @Prop()
  @Field({ nullable: false })
  shippingId?: string;

  @Prop()
  @Field({ nullable: false })
  id?: string;

  @Prop()
  @Field(() => Boolean, { nullable: false })
  active?: boolean;

  @Prop()
  @Field(() => String, { nullable: false })
  createdAt?: Date;

  @Prop()
  @Field({ nullable: false })
  updatedAt?: Date;

  @Prop()
  @Field({ nullable: false })
  deleted?: boolean;

  @Prop()
  @Field({ nullable: false })
  deletedAt?: Date;
}

// Define o tipo do documento Mongoose (com métodos, etc.)
export type OrderItemDocument = HydratedDocument<OrderItem>;

// Gera o schema Mongoose com base na classe decorada
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
