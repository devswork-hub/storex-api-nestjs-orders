export type CriteriaOptions<M> = {
  apply(items: M[]): M[];
};
