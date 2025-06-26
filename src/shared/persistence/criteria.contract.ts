export interface CriteriaContract<T> {
  apply(items: T[]): T[];
}
