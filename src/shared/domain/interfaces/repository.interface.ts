export interface RepositoryContract<M> {
  createOne?(entity: M): Promise<M>;
  createMany?(entity: M[]): Promise<M[]>;
  update?(entity: M): Promise<void>;
  delete?(entityId: string): Promise<void>;
  findById?(entityId: string): Promise<M | null>;
  findAll?(): Promise<M[]>;
}
