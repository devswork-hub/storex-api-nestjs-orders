import { CurrencyEnum } from '@/shared/domain/value-objects/currency.vo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class CurrencyMongoEntity {
  @Prop({ enum: CurrencyEnum, defaultValue: CurrencyEnum.BRL })
  currency: CurrencyEnum;
}

export const CurrencySchema = SchemaFactory.createForClass(CurrencyMongoEntity);
