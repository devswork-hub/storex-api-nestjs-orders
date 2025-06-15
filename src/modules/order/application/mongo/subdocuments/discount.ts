import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
@ObjectType()
export class DiscountSubdocument {
  @Field() @Prop() couponCode: string;
  @Field() @Prop() value: number;
  @Field() @Prop() type: string;
}
