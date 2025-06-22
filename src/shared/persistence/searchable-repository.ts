import { CriteriaContract } from './criteria.contract';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export type SearchableRepositoryContract<
  Model,
  Fields,
  SearchInput = SearchParams<Fields>,
  SearchOutput = SearchResult<Model>,
> = {
  search(input: SearchInput): Promise<SearchOutput>;
  searchByCriteria(criteria: CriteriaContract<Model>[]): Promise<SearchOutput>;
};
