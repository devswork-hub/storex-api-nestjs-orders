import { InMemoryBaseRepository } from 'src/shared/domain/base/in-memory-repository.base';
import { OrderModelContract } from '../order';
import { OrderRepositoryContract } from './order.repository';
import {
  SearchableRepositoryContract,
  SearchOptions,
  SearchResult,
} from '@/src/shared/persistence/search/searchable.repository.contract';
import { CriteriaOptions } from '@/src/shared/persistence/criteria.contract';
import { SearchableHandler } from '@/src/shared/persistence/search/searchable.handler';

export class OrderInMemoryRepository
  extends InMemoryBaseRepository<OrderModelContract>
  implements
    OrderRepositoryContract,
    SearchableRepositoryContract<OrderModelContract>
{
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
