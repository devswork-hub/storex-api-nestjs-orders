import { Field, Int, ObjectType } from '@nestjs/graphql';
import { OrderOuput } from './order.output';

@ObjectType()
export class PaginationOutput<Item = any> {
  @Field(() => OrderOuput)
  items: OrderOuput[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  current_page: number;

  @Field(() => Int)
  lastPage: number;

  @Field(() => Int)
  perPage: number;
}
