import { Field, ObjectType } from '@nestjs/graphql';
import { ChangeTo } from '@/src/app/utils/type';
import { Discount } from '../../../domain/order.constants';

type Output = ChangeTo<Discount, { type: string; currency: string }>;

@ObjectType({ description: 'Representa uma composição do Order' })
export class DiscountOutput implements Output {
  @Field() couponCode: string;
  @Field() value: number;
  @Field() type: string;
  @Field() currency: string;
}
