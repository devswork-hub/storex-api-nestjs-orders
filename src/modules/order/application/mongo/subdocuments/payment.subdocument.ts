import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InstallmentSubdocument } from './installment.subdocument';
import {
  PaymentMethodEnum,
  PaymentSnapshot,
  PaymentStatusEnum,
} from '../../../domain/order.constants';

@Schema({ _id: false })
export class PaymentSubdocument implements PaymentSnapshot {
  @Prop() method: PaymentMethodEnum;
  @Prop() status: PaymentStatusEnum;
  @Prop() amount: number;
  @Prop() transactionId?: string;
  @Prop({ type: [InstallmentSubdocument], default: [] })
  installments?: InstallmentSubdocument[];
}

export const PaymentSchema = SchemaFactory.createForClass(PaymentSubdocument);
