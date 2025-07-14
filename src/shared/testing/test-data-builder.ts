export class TestDataBuilder<T> {
  private data: Partial<T> = {};

  constructor(initialData?: Partial<T>) {
    if (initialData) {
      this.data = { ...initialData };
    }
  }
  // TODO: validar se esse faz sentido, em relacao ao construtor de cima
  // constructor(defaults?: Partial<T>) {
  //   if (defaults) {
  //     this.entity = defaults;
  //   }
  // }

  with<K extends keyof T>(key: K, value: T[K]): this {
    this.data[key] = value;
    return this;
  }

  build(): T {
    return this.data as T;
  }
}
