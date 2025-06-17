import { Field, ObjectType } from '@nestjs/graphql';
import { PaymentOutput } from './outputs/payment.output';
import { ShippingOutput } from './outputs/shipping.output';
import { BillingAddressOutput } from './outputs/billing-address.output';
import { DiscountOutput } from './outputs/discount.output';
import { OrderItemOutput } from './order-item.output';

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
