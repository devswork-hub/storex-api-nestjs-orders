import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PaginationInput {
  @Field(() => Number, { nullable: true, defaultValue: 0 })
  skip: number;

  @Field(() => Number, { nullable: true, defaultValue: 10 })
  limit: number;
}
