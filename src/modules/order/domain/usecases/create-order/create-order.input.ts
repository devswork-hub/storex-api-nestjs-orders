import { OmitBaseProps } from '@/src/shared/domain/type-utils/omit-base-props';
import { OrderModelInput } from '../../order';
import { BaseModelProps } from '@/src/shared/domain/base/model.base';

export type CreateOrderInput = OmitBaseProps<
  OrderModelInput,
  keyof BaseModelProps
>;
