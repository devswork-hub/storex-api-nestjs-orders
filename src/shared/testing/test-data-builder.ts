export abstract class TestDataBuilder<T> {
  protected defaults: Partial<T> = {};
  private data: Partial<T>;

  constructor(initialData?: Partial<T>) {
    this.data = { ...this.defaults, ...initialData };
  }

  with<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this;
  }

  build(): T {
    console.log(this.data);
    return this.data as T;
  }
}
