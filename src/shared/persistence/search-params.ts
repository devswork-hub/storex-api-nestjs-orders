export type SortDirection = 'asc' | 'desc';

export type SearchParamsProps<T = Record<string, any>> = {
  filter?: T;
  page?: number;
  perPage?: number;
  sort?: string;
  sortDir?: SortDirection;
};

export class SearchParams<T = Record<string, any>> {
  protected _page: number;
  protected _perPage: number;
  protected _sortField: string | null;
  protected _sortDir: SortDirection | null;
  protected _filter: T | null;

  constructor(props: SearchParamsProps<T>) {
    this._page = this.validatePage(props.page);
    this._perPage = this.validatePerPage(props.perPage);
    this._sortField = props.sort || null;
    this._sortDir = this.validateSortDir(props.sortDir);
    this._filter = props.filter || null;
  }

  public get page(): number {
    return this._page;
  }

  public get perPage(): number {
    return this._perPage;
  }

  public get sortField(): string | null {
    return this._sortField;
  }

  public get sortDir(): SortDirection | null {
    return this._sortDir;
  }

  public get filter(): T | null {
    return this._filter;
  }

  private validatePage(value?: number): number {
    const page = value ?? 1;
    return Number.isInteger(page) && page > 0 ? page : 1;
  }

  private validatePerPage(value?: number): number {
    const perPage = value ?? 10;
    return Number.isInteger(perPage) && perPage > 0 ? perPage : 10;
  }

  private validateSortDir(value?: SortDirection): SortDirection | null {
    return value === 'asc' || value === 'desc' ? value : null;
  }
}
