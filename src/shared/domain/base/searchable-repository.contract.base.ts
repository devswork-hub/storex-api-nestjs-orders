// import { OrderItemModel } from '@/modules/order/domain/order-item';

// export interface OffsetSearchResult<Item> extends BaseSearchResult<Item> {
//   type: 'offset';
//   currentPage: number;
//   perPage: number;
//   lastPage: number;
// }
// export interface CursorSearchResult<Item> extends BaseSearchResult<Item> {
//   type: 'cursor';
//   nextCursor: string | null;
//   hasNextPage: boolean;
// }

// export type SearchResult<Item> =
//   | OffsetSearchResult<Item>
//   | CursorSearchResult<Item>;

// type PaginationType = 'offset' | 'cursor';

// export type BaseSearchResult<M> = {
//   type: PaginationType;
//   items: M[];
//   total: number;
// };

// type PaginationOptions =
//   | { type: PaginationType; page?: number; limit?: number }
//   | { type: PaginationType; after?: string; limit?: number };

// type SearchOptions<T> = {
//   pagination?: PaginationOptions;
//   sort?: { field: keyof T; direction: 'asc' | 'desc' };
//   filter?: Partial<T>;
// };

// function handle(result: SearchResult<OrderModel>) {
//   if (result.type === 'offset') {
//     console.log('Página atual:', result.currentPage);
//   } else {
//     console.log('Próximo cursor:', result.nextCursor);
//   }
// }

// export type SearchableRepositoryContract<T> = {
//   findPaginated?(input: PaginationInput): {};
//   search(options: SearchOptions<OrderModel>): Promise<SearchResult<OrderModel>>;
//   search?(
//     query?: Partial<T>,
//     options?: {
//       cursor?: { after?: string; limit?: number };
//       offset?: { page?: number; limit?: number };
//       sort?: { field: string; direction: 'asc' | 'desc' };
//     },
//   ): Promise<{
//     items: T[];
//     total: number;
//     page: number;
//     limit: number;
//   }>;
// };

// type PaginationResult<M> = {
//   items: M[];
//   total: number;
//   page?: number;
//   limit?: number;
//   // para cursor-based
//   hasNextPage?: boolean;
//   endCursor?: string;
// };
// export type PaginationInput = {
//   page?: number;
//   limit?: number;
//   order?: { field: string; direction: 'asc' | 'desc' };
// };
