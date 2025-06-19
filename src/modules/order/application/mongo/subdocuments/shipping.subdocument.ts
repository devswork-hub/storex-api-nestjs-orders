import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class ShippingSubdocument {
  @Prop() shippingId?: string;
  @Prop() status: string;
  @Prop() carrier: string;
  @Prop() service: string;
  @Prop() fee?: number;
  @Prop() deliveryDate?: string;
  @Prop() recipient?: string;
}

export const ShippingSchema = SchemaFactory.createForClass(ShippingSubdocument);
