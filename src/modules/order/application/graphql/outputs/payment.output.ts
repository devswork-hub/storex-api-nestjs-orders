// import { InstallmentSubdocument } from './installment.subdocument';
import { Field, ObjectType } from '@nestjs/graphql';
import { PaymentSnapshot } from '../../../order.constants';
import { ChangeTo } from '@/src/app/utils/type';

type Output = ChangeTo<PaymentSnapshot, { method: string }>;

@ObjectType()
export class PaymentOutput implements Output {
  @Field() method: string;
  @Field() status: string;
  @Field() amount: number;
  @Field() transactionId?: string;
  // @Field()
  // @Prop({ type: [InstallmentSubdocument] })
  // installments?: InstallmentSubdocument[];
}
