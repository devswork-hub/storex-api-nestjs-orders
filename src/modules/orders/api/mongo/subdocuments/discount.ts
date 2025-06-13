import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class DiscountSubdocument {
  @Prop() couponCode: string;
  @Prop() value: number;
  @Prop() type: string;
}
