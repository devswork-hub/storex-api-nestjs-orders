import { Field, ObjectType } from '@nestjs/graphql';
import { DiscountOutput } from './discount.output';
import { MoneyOutput } from './money.output';
import { ChangeTo } from '@/shared/utils/type-utils';

type OutputType = ChangeTo<OrderItemOutput, {}>;

@ObjectType()
export class OrderItemOutput {
  @Field()
  productId: string;

  @Field()
  quantity: number;

  @Field(() => MoneyOutput)
  price: MoneyOutput;

  @Field(() => DiscountOutput, { nullable: true })
  discount?: DiscountOutput;

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
