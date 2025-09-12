export type WritableRepositoryContract<M> = {
  createOne(entity: M): Promise<M>;
  createMany?(entity: M[]): Promise<M[]>;
  update?(entity: M): Promise<void>;
  delete?(entityId: string): Promise<void>;
};

export type ReadableRepositoryContract<M> = {
  findAll(): Promise<M[]>;
  findById?(entityId: string): Promise<M | null>;
  findOneBy?(query?: Partial<M>): Promise<M | null>;
  findBy?(
    query: Partial<M>,
    order?: { field: string; direction: 'asc' | 'desc' },
  ): Promise<M[]>;
};
