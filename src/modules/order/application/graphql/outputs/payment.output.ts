import { Field, ObjectType } from '@nestjs/graphql';
import { ChangeTo } from '@/src/app/utils/type';
import { InstallmentOutput } from './installment.output';

type Output = ChangeTo<PaymentOutput, { method: string }>;

@ObjectType()
export class PaymentOutput implements Output {
  @Field() method: string;
  @Field() status: string;
  @Field() amount: number;
  @Field() transactionId?: string;
  @Field(() => [InstallmentOutput], { nullable: true })
  installments?: InstallmentOutput[];
}
