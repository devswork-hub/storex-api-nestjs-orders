// 🔍 Busca; ↕️ Ordenação; 📄 Paginação; 🎯 Filtros; 📦 Projeção
// Description: Defines the SearchableRepositoryContract interface for advanced search operations in a repository,
// supporting filters, multiple pagination strategies, and sorting.

import { CriteriaOptions } from '../criteria.contract';

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
  searchByCriteria(criteria: CriteriaOptions<M>[]): Promise<SearchResult<M>>;
}
