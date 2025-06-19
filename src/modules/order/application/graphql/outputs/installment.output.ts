import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InstallmentOutput {
  @Field() number: number;
  @Field() value: number;
  @Field() interestRate?: number;
  @Field() totalValue?: number;
  @Field() dueDate?: string;
}
