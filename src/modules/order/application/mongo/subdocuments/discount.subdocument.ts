import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Discount, DiscountTypeEnum } from '../../../domain/order.constants';
import { ChangeTo } from '@/src/shared/utils/type-utils';

export type DiscountSubdocumentProps = ChangeTo<
  Discount,
  { type: string; currency: string }
>;

@Schema({ _id: false })
export class DiscountSubdocument implements DiscountSubdocumentProps {
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
