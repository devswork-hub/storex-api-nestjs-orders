// 🔍 Busca; ↕️ Ordenação; 📄 Paginação; 🎯 Filtros; 📦 Projeção
// Description: Defines the SearchableRepositoryContract interface for advanced search operations in a repository,
// supporting filters, multiple pagination strategies, and sorting.

export type PaginationType = 'offset' | 'cursor';

export type OffsetPagination = {
  type: 'offset';
  page?: number;
  limit?: number;
};

export type CursorPagination = {
  type: 'cursor';
  after?: string;
  limit?: number;
};

export type PaginationOptions = OffsetPagination | CursorPagination;

export interface SimpleSearchResult<T> {
  items: T[];
  total: number;
}

/**
 * Common structure for all paginated results.
 */
export interface BaseSearchResult<M> {
  type: PaginationType;
  items: M[];
  total: number;
}

/**
 * 📄 Result structure for offset-based pagination.
 */
export interface OffsetSearchResult<M> extends BaseSearchResult<M> {
  type: 'offset';
  currentPage: number;
  perPage: number;
  lastPage: number;
}

/**
 * 🔗 Result structure for cursor-based pagination.
 */
export interface CursorSearchResult<M> extends BaseSearchResult<M> {
  type: 'cursor';
  nextCursor: string | null;
  hasNextPage: boolean;
}

/**
 * Unified result type combining both pagination strategies.
 */
export type SearchResult<M> =
  | OffsetSearchResult<M>
  | CursorSearchResult<M>
  | SimpleSearchResult<M>;

/**
 * Full set of search options.
 */
export type SearchOptions<M> = {
  /**
   * 🎯 Filters by partial fields of the entity.
   */
  filter?: Partial<M>;

  /**
   * 📄 Offset or 🔗 cursor-based pagination strategy.
   */
  pagination?: PaginationOptions;

  /**
   * ↕️ Ordering by a specific field and direction.
   */
  sort?: {
    field: keyof M;
    direction: 'asc' | 'desc';
  };
};

/**
 * 🔍 Contract for searchable repositories with support for:
 * - 🎯 Filters
 * - 📄 Paginação offset
 * - 🔗 Paginação por cursor
 * - ↕️ Ordenação
 */
export interface SearchableRepositoryContract<M> {
  search(options: SearchOptions<M>): Promise<SearchResult<M>>;
}

// type Entity = { id: string; name: string };
// const data: Entity[] = [
//   { id: '1', name: 'Banana' },
//   { id: '2', name: 'Maçã' },
//   { id: '3', name: 'Laranja' },
//   { id: '4', name: 'Abacaxi' },
//   { id: '5', name: 'Uva' },
//   { id: '6', name: 'Kiwi' },
//   { id: '7', name: 'Pera' },
// ];

// const repo: SearchableRepositoryContract<Entity> = {
//   async search({ filter, sort, pagination }: SearchOptions<Entity>) {
//     let results = [...data];

//     // 🎯 Filtro por nome (parcial, case-insensitive)
//     if (filter?.name) {
//       results = results.filter((item) =>
//         item.name.toLowerCase().includes(filter.name.toLowerCase()),
//       );
//     }

//     // ↕️ Ordenação por campo
//     if (sort) {
//       results.sort((a, b) => {
//         const aValue = a[sort.field];
//         const bValue = b[sort.field];
//         if (typeof aValue === 'string' && typeof bValue === 'string') {
//           return sort.direction === 'asc'
//             ? aValue.localeCompare(bValue)
//             : bValue.localeCompare(aValue);
//         }
//         return 0;
//       });
//     }

//     // 📄 Paginação offset
//     if (pagination?.type === 'offset') {
//       const page = pagination.page ?? 1;
//       const limit = pagination.limit ?? 10;
//       const offset = (page - 1) * limit;
//       const paginated = results.slice(offset, offset + limit);

//       return {
//         type: 'offset',
//         items: paginated,
//         total: results.length,
//         currentPage: page,
//         perPage: limit,
//         lastPage: Math.ceil(results.length / limit),
//       } satisfies OffsetSearchResult<Entity>;
//     }

//     // 🔗 Paginação cursor
//     if (pagination?.type === 'cursor') {
//       const limit = pagination.limit ?? 5;
//       const startIndex = pagination.after
//         ? results.findIndex((item) => item.id === pagination.after) + 1
//         : 0;
//       const paginated = results.slice(startIndex, startIndex + limit);
//       const nextCursor =
//         startIndex + limit < results.length
//           ? (paginated[paginated.length - 1]?.id ?? null)
//           : null;

//       return {
//         type: 'cursor',
//         items: paginated,
//         total: results.length,
//         nextCursor,
//         hasNextPage: nextCursor !== null,
//       } satisfies CursorSearchResult<Entity>;
//     }

//     // ✅ Fallback: sem paginação => retorna todos os itens
//     return {
//       type: 'offset',
//       items: results,
//       total: results.length,
//       currentPage: 1,
//       perPage: results.length,
//       lastPage: 1,
//     } satisfies OffsetSearchResult<Entity>;
//   },
// };
