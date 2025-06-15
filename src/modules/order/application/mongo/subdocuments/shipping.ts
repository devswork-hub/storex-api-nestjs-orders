import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
@ObjectType()
export class ShippingSubdocument {
  @Field() @Prop() shippingId?: string;
  @Field() @Prop() status: string; // ou ShippingStatus enum
  @Field() @Prop() carrier: string;
  @Field() @Prop() service: string;
  @Field() @Prop() fee?: number;
  @Field() @Prop() deliveryDate?: string;
  @Field() @Prop() recipient?: string;
}
