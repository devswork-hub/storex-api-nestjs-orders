import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DiscountSubdocument } from '../subdocuments/discount.subdocument';
import { PaymentSubdocument } from '../subdocuments/payment.subdocument';
import { ShippingSubdocument } from '../subdocuments/shipping.subdocument';
import { BillingAddressSubdocument } from '../subdocuments/billing-address.subdocument';
import { OrderItemSubdocument, OrderItemSchema } from './order-item.document';
import { OrderStatusEnum } from '@/src/modules/order/domain/order.constants';

export type OrderMongoEntityProps = Omit<OrderDocument, 'id'> & {
  _id: string;
};

@Schema({ timestamps: true })
export class OrderMongoEntity {
  @Prop({ type: String, required: true })
  _id: string;

  @Prop({ required: true, enum: OrderStatusEnum })
  status: string;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItemSubdocument[];

  @Prop({ required: true })
  currency: string;

  @Prop({ type: PaymentSubdocument, required: true })
  paymentSnapshot: PaymentSubdocument;

  @Prop({ type: ShippingSubdocument, required: true })
  shippingSnapshot: ShippingSubdocument;

  @Prop({ type: BillingAddressSubdocument, required: true })
  billingAddress: BillingAddressSubdocument;

  @Prop({ required: true })
  customerId: string;

  @Prop()
  paymentId: string;

  @Prop({ max: 100 })
  notes?: string;

  @Prop({ type: DiscountSubdocument })
  discount?: DiscountSubdocument;

  @Prop() active?: boolean;
  @Prop() createdAt?: Date;
  @Prop() updatedAt?: Date;
  @Prop() deleted?: boolean;
  @Prop() deletedAt?: Date;

  // TODO: Verificar se isso eh viavel no futuro
  // @Prop({
  //   validate: function (value) {
  //     return new Date(value) <= new Date();
  //   },
  // })
  // deletedAt?: Date;
}

export type OrderDocument = HydratedDocument<OrderMongoEntity>;
export const OrderSchema = SchemaFactory.createForClass(OrderMongoEntity);
