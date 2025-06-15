import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
@ObjectType()
export class BillingAddressSubdocument {
  @Field()
  @Prop()
  street: string;
  @Field()
  @Prop()
  city: string;
  @Field()
  @Prop()
  state: string;
  @Field()
  @Prop()
  zipCode: string;
}
