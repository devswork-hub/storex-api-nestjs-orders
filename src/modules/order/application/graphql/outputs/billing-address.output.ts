import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BillingAddressOutput {
  @Field()
  street: string;
  @Field()
  city: string;
  @Field()
  state: string;
  @Field()
  zipCode: string;
}
