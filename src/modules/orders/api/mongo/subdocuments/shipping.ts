import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ShippingSubdocument {
  @Prop() shippingId?: string;
  @Prop() status: string; // ou ShippingStatus enum
  @Prop() carrier: string;
  @Prop() service: string;
  @Prop() fee?: number;
  @Prop() deliveryDate?: string;
  @Prop() recipient?: string;
}
