import { BaseRepositoryContract } from 'src/shared/domain/base/repository.contract.base';
import { OrderModelContract } from '../order';

export type OrderRepositoryContract =
  BaseRepositoryContract<OrderModelContract>;
