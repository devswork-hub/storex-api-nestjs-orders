import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { OrderStatus, OrderStatusEnum } from '../../../order/order-status';
import { ChangeTo } from 'src/app/utils/type';
import { BillingAddressSubdocument } from './subdocuments/billing-address';
import { PaymentSubdocument } from './subdocuments/payment.subdocument';
import { ShippingSubdocument } from './subdocuments/shipping';
import { HydratedDocument } from 'mongoose';
import { DiscountSubdocument } from './subdocuments/discount';
import { Field, ObjectType } from '@nestjs/graphql';
import { OrderModelContract } from '../../order';
import { OrderItem } from '../../order-item';
import { OrderStatus, OrderStatusEnum } from '../../order.constants';
import {
  Currency,
  CurrencyEnum,
} from '@/src/shared/domain/value-objects/currency.vo';

export type Change = ChangeTo<
  OrderModelContract,
  {
    paymentSnapshot: PaymentSubdocument;
    shippingSnapshot: ShippingSubdocument;
    billingAddress: BillingAddressSubdocument;
    discount?: DiscountSubdocument;
  }
>;

@Schema({ timestamps: true })
@ObjectType(OrderMongoSchema.name) // Define o nome no schema GraphQL, pode ser útil se quiser renomear ali
export class OrderMongoSchema {
  @Field()
  @Prop({
    required: true,
    enum: OrderStatusEnum,
    default: OrderStatusEnum.PENDING,
  })
  @Field()
  status: OrderStatus;

  @Prop({ required: true })
  items: OrderItem[];

  @Prop({ required: true })
  subTotal: number;

  @Field()
  @Prop({ required: true })
  total: number;

  // @Field()
  // @Prop({ required: true, enum: CurrencyEnum, default: CurrencyEnum.BRL })
  // currency: Currency;

  @Field()
  @Prop({ required: true })
  paymentSnapshot: PaymentSubdocument;

  @Field()
  @Prop({ required: true })
  shippingSnapshot: ShippingSubdocument;

  @Field()
  @Prop({ required: true })
  billingAddress: BillingAddressSubdocument;

  @Field()
  @Prop({ required: true })
  customerId: string;

  @Field()
  @Prop({ required: true })
  paymentId: string;

  @Field()
  @Prop({ required: false })
  notes?: string;

  @Field()
  @Prop({ required: false })
  discount?: DiscountSubdocument;
}

// Define o tipo do documento Mongoose (com métodos, etc.)
export type OrderDocument = HydratedDocument<OrderMongoSchema>;

// Gera o schema Mongoose com base na classe decorada
export const OrderSchema = SchemaFactory.createForClass(OrderMongoSchema);
