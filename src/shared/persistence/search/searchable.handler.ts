import {
  CursorSearchResult,
  OffsetSearchResult,
  SearchableRepositoryContract,
  SearchOptions,
  SearchResult,
} from './searchable.repository.contract';

export class SearchableHandler<T> {
  constructor(private readonly repository: SearchableRepositoryContract<T>) {}

  async handle(options: SearchOptions<T>): Promise<SearchResult<T>> {
    const filter = options.filter ?? {};
    const sort = options.sort;
    const pagination = options.pagination;

    const { items, total } = await this.repository.search({});

    // Monta a estrutura de retorno correta com base no tipo de paginação
    if (pagination?.type === 'offset') {
      const page = pagination.page ?? 1;
      const limit = pagination.limit ?? 10;
      const lastPage = Math.ceil(total / limit);

      const result: OffsetSearchResult<T> = {
        type: 'offset',
        items,
        total,
        currentPage: page,
        perPage: limit,
        lastPage,
      };

      return { ...result };
    }

    if (pagination?.type === 'cursor') {
      const hasNextPage = items.length === (pagination.limit ?? 10);
      const nextCursor = hasNextPage ? this.getNextCursor(items) : null;

      const result: CursorSearchResult<T> = {
        type: 'cursor',
        items,
        total,
        hasNextPage,
        nextCursor,
      };

      return result;
    }

    // Default fallback (sem paginação)
    return {
      type: 'offset',
      items,
      total,
      currentPage: 1,
      perPage: items.length,
      lastPage: 1,
    };
  }

  private getNextCursor(items: T[]): string | null {
    // ⚠️ Esta lógica depende do seu modelo. Exemplo usando `id`:
    const lastItem = items[items.length - 1];
    const id = (lastItem as any)?.id;
    return id ? String(id) : null;
  }
}
