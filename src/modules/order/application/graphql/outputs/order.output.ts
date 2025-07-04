import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaymentOutput } from './payment.output';
import { ShippingOutput } from './shipping.output';
import { BillingAddressOutput } from './billing-address.output';
import { DiscountOutput } from './discount.output';
import { OrderItemOutput } from './order-item.output';
import { OrderStatusEnum } from '../../../domain/order.constants';

registerEnumType(OrderStatusEnum, {
  name: 'OrderStatus',
  description: 'Possible order statuses',
});

@ObjectType()
export class OrderOuput {
  @Field()
  status: string;

  @Field(() => [OrderItemOutput])
  items: OrderItemOutput[];

  @Field()
  subTotal: number;

  @Field()
  total: number;

  @Field()
  currency: string;

  @Field(() => PaymentOutput)
  paymentSnapshot: PaymentOutput;

  @Field(() => ShippingOutput)
  shippingSnapshot: ShippingOutput;

  @Field(() => BillingAddressOutput)
  billingAddress: BillingAddressOutput;

  @Field()
  customerId: string;

  @Field()
  paymentId: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => DiscountOutput, { nullable: true })
  discount?: DiscountOutput;

  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  active?: boolean;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field({ nullable: true })
  deleted?: boolean;

  @Field({ nullable: true })
  deletedAt?: Date;
}
