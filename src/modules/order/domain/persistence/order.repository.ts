import { BaseRepositoryContract } from 'src/shared/domain/base/repository.contract.base';
import { OrderModelContract, OrderModelInput } from '../order';
import { SearchableRepositoryContract } from '@/shared/persistence/search/searchable.repository.contract';

export type OrderRepositoryContract = {
  update: (order: OrderModelInput) => Promise<void>;
  findBy(query: Partial<OrderModelContract>): Promise<OrderModelContract[]>;
} & BaseRepositoryContract<OrderModelContract> &
  SearchableRepositoryContract<OrderModelContract>;
