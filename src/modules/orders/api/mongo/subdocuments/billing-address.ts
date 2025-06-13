import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class BillingAddressSubdocument {
  @Prop() street: string;
  @Prop() city: string;
  @Prop() state: string;
  @Prop() zipCode: string;
}
