// order-item.output.ts
import { Field, ObjectType } from '@nestjs/graphql';
import { DiscountSubdocument } from '../mongo/subdocuments/discount';
import { MoneyOutput } from '../mongo/money.output';

@ObjectType()
export class OrderItemOutput {
  @Field()
  productId: string;

  @Field()
  quantity: number;

  @Field(() => MoneyOutput)
  price: MoneyOutput;

  @Field(() => DiscountSubdocument, { nullable: true })
  discount?: DiscountSubdocument;

  @Field({ nullable: true })
  seller?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  shippingId?: string;

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
