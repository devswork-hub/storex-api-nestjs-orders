import { Field, ObjectType } from '@nestjs/graphql';
import { PaymentSubdocument } from '../mongo/subdocuments/payment.subdocument';
import { ShippingSubdocument } from '../mongo/subdocuments/shipping';
import { BillingAddressSubdocument } from '../mongo/subdocuments/billing-address';
import { DiscountSubdocument } from '../mongo/subdocuments/discount';
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

  @Field(() => PaymentSubdocument)
  paymentSnapshot: PaymentSubdocument;

  @Field(() => ShippingSubdocument)
  shippingSnapshot: ShippingSubdocument;

  @Field(() => BillingAddressSubdocument)
  billingAddress: BillingAddressSubdocument;

  @Field()
  customerId: string;

  @Field()
  paymentId: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => DiscountSubdocument, { nullable: true })
  discount?: DiscountSubdocument;

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
