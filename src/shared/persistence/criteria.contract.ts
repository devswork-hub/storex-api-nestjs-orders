export interface CriteriaContract<Criteria> {
  apply(context: Criteria): Criteria;
}
  