// import {
//   OrderModel,
//   OrderModelContract,
// } from '@/src/modules/order/domain/order';
// import { SearchParams } from './search-params';
// import { SearchResult } from './search-result';
// import { CriteriaContract } from './criteria.contract';

import { CriteriaContract } from './criteria.contract';
import { SearchParams } from './search-params';
import { SearchResult } from './search-result';

export type SearchResultProps = {};

export interface SearchableRepositoryContract<
  Model,
  Fields = Partial<Model>,
  SearchInput = SearchParams<Fields>,
  SearchOutput = SearchResult<Model>,
> {
  search(input: SearchInput): Promise<SearchOutput>;
  searchByCriteria(criteria: CriteriaContract<Model>[]): Promise<SearchOutput>;
}

// // Replace 'any' with the actual type for Fields if known
// const s: SearchableRepositoryContract<
//   OrderModelContract,
//   keyof OrderModelContract
// > = {};

// // You must use the SearchParams class constructor here
// s.search(
//   new SearchParams<keyof OrderModelContract>({
//     page: 0,
//     perPage: 0,
//     sortDir: 'asc',
//     filter: 'status',
//   }),
// );

// async search({ page = 1, perPage = 10, sort, filter }: SearchParams<OrderModel>) {
//   let data = [...this.items];

//   if (filter) {
//     for (const [key, value] of Object.entries(filter)) {
//       data = data.filter((item) => item[key as keyof OrderModel] === value);
//     }
//   }

//   if (sort) {
//     data.sort((a, b) => {
//       const aVal = a[sort.field];
//       const bVal = b[sort.field];
//       if (aVal === bVal) return 0;
//       return sort.direction === 'desc'
//         ? aVal > bVal ? -1 : 1
//         : aVal > bVal ? 1 : -1;
//     });
//   }

//   const total = data.length;
//   const start = (page - 1) * perPage;
//   const end = start + perPage;
//   const items = data.slice(start, end);

//   return {
//     items,
//     total,
//     currentPage: page,
//     perPage,
//     lastPage: Math.ceil(total / perPage),
//   };
// }

// async searchByCriteria(criteriaList: CriteriaContract<OrderModel>[]) {
//   let result = [...this.items];
//   for (const criteria of criteriaList) {
//     result = criteria.apply(result);
//   }
//   return {
//     items: result,
//     total: result.length,
//     currentPage: 1,
//     perPage: result.length,
//     lastPage: 1,
//   };
// }
