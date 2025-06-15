import { Prop, Schema } from '@nestjs/mongoose';
import { InstallmentSubdocument } from './installment.subdocument';
import { Field, ObjectType } from '@nestjs/graphql';

@Schema({ _id: false })
@ObjectType()
export class PaymentSubdocument {
  @Field()
  @Prop()
  method: string;

  @Field()
  @Prop()
  status: string;

  @Field()
  @Prop()
  amount: number;

  @Field()
  @Prop()
  transactionId?: string;

  // @Field()
  // @Prop({ type: [InstallmentSubdocument] })
  // installments?: InstallmentSubdocument[];
}
