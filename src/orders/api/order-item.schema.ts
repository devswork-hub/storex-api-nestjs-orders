import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
@ObjectType()
export class OrderItem {
  @Field(() => ID)
  _id: string;

  @Prop({ unique: true, required: [true, 'Product ID Must be Unique'] })
  @Field(() => String)
  productId: string;

  @Prop({ trim: true, required: true, min: 0 })
  @Field(() => Float)
  quantity: number;

  @Prop({ trim: true, required: true, min: 0 })
  @Field(() => Float)
  price: number;
}

export type OrderItemDicument = OrderItem & Document;
export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
