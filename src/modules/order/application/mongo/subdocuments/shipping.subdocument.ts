import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ShippingSnapshot,
  ShippingStatus,
} from '../../../domain/order.constants';

@Schema({ _id: false })
export class ShippingSubdocument implements ShippingSnapshot {
  @Prop() shippingId?: string;
  @Prop() status: ShippingStatus;
  @Prop() carrier: string;
  @Prop() service: string;
  @Prop() fee?: number;
  @Prop() deliveryDate?: string;
  @Prop() recipient?: string;
}

export const ShippingSchema = SchemaFactory.createForClass(ShippingSubdocument);
