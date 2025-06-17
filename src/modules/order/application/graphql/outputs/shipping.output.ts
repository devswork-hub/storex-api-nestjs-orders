import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ShippingOutput {
  @Field() shippingId?: string;
  @Field() status: string;
  @Field() carrier: string;
  @Field() service: string;
  @Field() fee?: number;
  @Field() deliveryDate?: string;
  @Field() recipient?: string;
}
