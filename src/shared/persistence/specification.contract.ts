export interface Specification<T> {
  and(other: T): Promise<T>;
  andOrNot(other: T): Promise<T>;
  or(other: T): Promise<T>;
  orNot(other: T): Promise<T>;
  not(): Promise<T>;
}
