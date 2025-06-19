import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DiscountSubdocument } from './subdocuments/discount.subdocument';
import { MoneySchema } from './subdocuments/money.subdocument';

@Schema()
export class OrderItemDocument {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: MoneySchema, required: true })
  price: {
    amount: number;
    currency: string;
  };
  @Prop()
  discount?: DiscountSubdocument;

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

export const OrderItemSchema = SchemaFactory.createForClass(OrderItemDocument);
