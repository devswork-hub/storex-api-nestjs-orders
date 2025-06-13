import { Prop, Schema } from '@nestjs/mongoose';
import { InstallmentSubdocument } from './installment.subdocument';

@Schema({ _id: false })
export class PaymentSubdocument {
  @Prop()
  method: string;

  @Prop()
  status: string;

  @Prop()
  amount: number;

  @Prop()
  transactionId?: string;

  @Prop({ type: [InstallmentSubdocument] })
  installments?: InstallmentSubdocument[];
}
