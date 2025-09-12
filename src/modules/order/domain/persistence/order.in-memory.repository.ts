import { InMemoryBaseRepository } from 'src/shared/domain/base/in-memory-repository.base';
import { OrderModelContract } from '../order';
import {
  SearchableRepositoryContract,
  SearchOptions,
  SearchResult,
} from '@/shared/persistence/search/searchable.repository.contract';
import { CriteriaOptions } from '@/shared/persistence/criteria.contract';
import { SearchableHandler } from '@/shared/persistence/search/searchable.handler';
import {
  OrderReadableRepositoryContract,
  OrderWritableRepositoryContract,
} from '../../application/persistence/order.respository';
import { EntityManager } from 'typeorm';

type OrderRepositoryContract = OrderReadableRepositoryContract &
  OrderWritableRepositoryContract;

export class OrderInMemoryRepository
  extends InMemoryBaseRepository<OrderModelContract>
  implements
    OrderRepositoryContract,
    SearchableRepositoryContract<OrderModelContract>
{
  async createOne(order: OrderModelContract): Promise<any> {
    await super.createOne(order);
  }
  createOneWithTransaction?(
    order: OrderModelContract,
    manager: EntityManager,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  setTransactionManager?(manager: EntityManager): void {
    throw new Error('Method not implemented.');
  }
  search(
    options: SearchOptions<OrderModelContract>,
  ): Promise<SearchResult<OrderModelContract>> {
    return new SearchableHandler(this.items).handle(options);
  }

  // TODO: criar um handler somente pra tratar criterias
  searchByCriteria(
    criteria: CriteriaOptions<OrderModelContract>[],
  ): Promise<SearchResult<OrderModelContract>> {
    throw new Error('Method not implemented.');
  }
}
