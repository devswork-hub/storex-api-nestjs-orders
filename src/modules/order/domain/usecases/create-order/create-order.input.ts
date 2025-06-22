import { OmitBaseProps } from '@/src/shared/domain/type-utils/omit-base-props';
import { OrderModelInput } from '../../order';

export type CreateOrderInput = OmitBaseProps<OrderModelInput>;
