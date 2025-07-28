import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DiscountSubdocument } from '../subdocuments/discount.subdocument';
import {
  MoneySchema,
  MoneySubdocument,
} from '../subdocuments/money.subdocument';
import { ChangeTo } from '@/src/shared/utils/type-utils';
import { OrderItemModelContract } from '@/src/modules/order/domain/order-item';

export type OrderItemMongoEntityProps = ChangeTo<
  Omit<OrderItemModelContract, 'id'> & { _id: string },
  {
    price: MoneySubdocument;
    discount?: DiscountSubdocument;
  }
>;

@Schema({ _id: false })
export class OrderItemSubdocument implements OrderItemMongoEntityProps {
  @Prop()
  _id: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: MoneySchema, required: true })
  price: MoneySubdocument;

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

export const OrderItemSchema =
  SchemaFactory.createForClass(OrderItemSubdocument);
