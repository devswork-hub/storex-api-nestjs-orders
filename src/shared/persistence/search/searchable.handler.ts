import {
  CursorSearchResult,
  OffsetSearchResult,
  SearchableRepositoryContract,
  SearchOptions,
  SearchResult,
} from './searchable.repository.contract';

export class SearchableHandler<T extends Record<string, any>> {
  constructor(private readonly data: T[]) {} // aqui não é o repositório ainda, só dados mockados

  async handle(options: SearchOptions<T>): Promise<SearchResult<T>> {
    const filter = options.filter ?? {};
    const sort = options.sort;
    const pagination = options.pagination;

    // 🎯 FILTRO
    let filtered = this.data;
    for (const [key, value] of Object.entries(filter)) {
      filtered = filtered.filter((item) => item[key] === value);
    }

    // ↕️ SORT
    if (sort) {
      const { field, direction } = sort;
      filtered = filtered.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        if (aVal === bVal) return 0;

        const result = aVal > bVal ? 1 : -1;
        return direction === 'desc' ? -result : result;
      });
    }

    const total = filtered.length;

    // 📄 OFFSET PAGINATION
    if (pagination?.type === 'offset') {
      const page = pagination.page ?? 1;
      const limit = pagination.limit ?? 10;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginated = filtered.slice(start, end);
      const lastPage = Math.ceil(total / limit);

      return {
        type: 'offset',
        items: paginated,
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
      };
    }

    // 🔗 CURSOR PAGINATION
    if (pagination?.type === 'cursor') {
      const limit = pagination.limit ?? 10;
      const startAfter = pagination.after;
      let startIndex = 0;

      if (startAfter) {
        const index = filtered.findIndex(
          (item) => String(item.id) === startAfter,
        );
        startIndex = index >= 0 ? index + 1 : 0;
      }

      const paginated = filtered.slice(startIndex, startIndex + limit);
      const hasNextPage = startIndex + limit < total;
      const nextCursor = hasNextPage
        ? String(paginated[paginated.length - 1]?.id)
        : null;

      return {
        type: 'cursor',
        items: paginated,
        total,
        hasNextPage,
        nextCursor,
      };
    }

    // 🔙 SEM PAGINAÇÃO
    return {
      items: filtered,
      total,
    };
  }
}
