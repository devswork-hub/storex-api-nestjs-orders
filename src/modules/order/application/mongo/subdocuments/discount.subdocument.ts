import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { DiscountTypeEnum } from '../../../domain/order.constants';

@Schema({ _id: false })
export class DiscountSubdocument {
  @Prop({ required: true })
  couponCode: string;

  @Prop({ required: true })
  value: number;

  @Prop({
    required: true,
    enum: DiscountTypeEnum,
    default: DiscountTypeEnum.FIXED,
  })
  type: string;

  @Prop({ required: true })
  currency: string;
}

export const DiscountSchema = SchemaFactory.createForClass(DiscountSubdocument);
