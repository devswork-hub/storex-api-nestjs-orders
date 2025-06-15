import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
@ObjectType()
export class InstallmentSubdocument {
  @Field() @Prop() number: number;
  @Field() @Prop() value: number;
  @Field() @Prop() interestRate?: number;
  @Field() @Prop() totalValue?: number;
  @Field() @Prop() dueDate?: string;
}
