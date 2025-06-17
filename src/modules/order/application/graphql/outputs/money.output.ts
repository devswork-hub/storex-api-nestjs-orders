import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Representa o objeto de valor, Money' })
export class MoneyOutput {
  @Field()
  amount: number;

  @Field()
  currency: string;
}
