import { ChangeTo } from '@/src/app/utils/type';
import { Currency } from '@/src/shared/domain/value-objects/currency.vo';
import { MoneyProps } from '@/src/shared/domain/value-objects/money.vo';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type MoneySubdocumentProps = ChangeTo<MoneyProps, { currency: string }>;

@Schema({ _id: false })
export class MoneySubdocument implements MoneySubdocumentProps {
  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;
}

export const MoneySchema = SchemaFactory.createForClass(MoneySubdocument);
