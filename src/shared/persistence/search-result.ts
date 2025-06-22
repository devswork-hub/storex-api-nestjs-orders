export type SearchResultProps<E> = {
  items: E[];
  total: number;
  currentPage: number;
  perPage: number;
  lastPage: number;
};

export class SearchResult<E> {
  readonly items: E[];
  readonly total: number;
  readonly currentPage: number;
  readonly perPage: number;
  readonly lastPage: number;

  constructor(props: SearchResultProps<E>) {
    this.items = props.items;
    this.total = props.total;
    this.currentPage = props.currentPage;
    this.perPage = props.perPage;
    this.lastPage = Math.ceil(this.total / this.perPage);
  }

  toJSON(forceEntity = false) {
    return {
      items: forceEntity ? this.items.map((item) => item) : this.items,
      total: this.total,
      current_page: this.currentPage,
      per_page: this.perPage,
      last_page: this.lastPage,
    };
  }
}
