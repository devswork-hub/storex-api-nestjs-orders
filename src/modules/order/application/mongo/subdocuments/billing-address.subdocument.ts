import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BillingAddress } from '../../../domain/order.constants';

@Schema({ _id: false })
export class BillingAddressSubdocument implements BillingAddress {
  @Prop() street: string;
  @Prop() city: string;
  @Prop() state: string;
  @Prop() zipCode: string;
}

export const BillingAddressSchema = SchemaFactory.createForClass(
  BillingAddressSubdocument,
);
