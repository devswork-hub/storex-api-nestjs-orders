import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { OrderStatus, OrderStatusEnum } from '../../../order/order-status';
import { ChangeTo } from 'src/app/utils/type';
import { BillingAddressOutput } from '../graphql/outputs/billing-address.output';
import { PaymentOutput } from '../graphql/outputs/payment.output';
import { ShippingOutput } from '../graphql/outputs/shipping.output';
import { HydratedDocument } from 'mongoose';
import { DiscountOutput } from '../graphql/outputs/discount.output';
import { Field, ObjectType } from '@nestjs/graphql';
import { OrderModelContract } from '../../order';
import { OrderItem } from '../../order-item';
import { OrderStatus, OrderStatusEnum } from '../../order.constants';
import { CurrencyOutput } from '../graphql/outputs/currency.output';

export type Change = ChangeTo<
  OrderModelContract,
  {
    currency: CurrencyOutput;
    paymentSnapshot: PaymentOutput;
    shippingSnapshot: ShippingOutput;
    billingAddress: BillingAddressOutput;
    discount?: DiscountOutput;
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

  @Field()
  // @Prop({ required: true, enum: CurrencyEnum, default: CurrencyEnum.BRL })
  @Prop()
  currency: CurrencyOutput;

  @Field()
  @Prop({ required: true })
  paymentSnapshot: PaymentOutput;

  @Field()
  @Prop({ required: true })
  shippingSnapshot: ShippingOutput;

  @Field()
  @Prop({ required: true })
  billingAddress: BillingAddressOutput;

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
  discount?: DiscountOutput;
}

// Define o tipo do documento Mongoose (com métodos, etc.)
export type OrderDocument = HydratedDocument<OrderMongoSchema>;

// Gera o schema Mongoose com base na classe decorada
export const OrderSchema = SchemaFactory.createForClass(OrderMongoSchema);
