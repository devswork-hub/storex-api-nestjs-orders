import { BaseModelProps } from '@/src/shared/domain/base/model.base';
import { OmitBaseProps } from '@/src/shared/domain/type-utils/omit-base-props';
import { OrderModelContract } from '../order';
import { Money } from '@/src/shared/domain/value-objects/money.vo';

export type CreateOrderCommand = Omit<
  OmitBaseProps<OrderModelContract, keyof BaseModelProps>,
  'subTotal' | 'total'
>;
