import { OrderModelContract } from '../order';

export type OrderSearchInput = Pick<
  OrderModelContract,
  'active' | 'status' | 'createdAt' | 'customerId'
>;
