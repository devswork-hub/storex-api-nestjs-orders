import { Field, ObjectType } from '@nestjs/graphql';
import {
  CurrencyEnum,
  CurrencyType,
} from '../../../../../shared/domain/value-objects/currency.vo';

@ObjectType({
  description:
    'Representa o objeto de valor, Currency, retornano uma simples string',
})
export class CurrencyOutput implements Omit<CurrencyType, 'code'> {
  @Field({ defaultValue: CurrencyEnum.BRL.toString() })
  currency: string;
}
