export interface RepositoryContract<M> {
  createOne?(entity: M): Promise<M>;
  createMany?(entity: M[]): Promise<M[]>;
  update?(entity: M): Promise<void>;
  delete?(entityId: string): Promise<void>;
  findById?(entityId: string): Promise<M | null>;
  findAll?(): Promise<M[]>;

  // Posso buscar um registro por um campo especifico
  findOneBy?(query?: Partial<M>): Promise<M | null>;

  // Posso buscar varios registros por um campo especifico
  // E posso definir a ordenacao dos registros com base no campo
  findBy?(
    query: Partial<M>,
    order?: { field: string; direction: 'asc' | 'desc' },
  ): Promise<M[]>;
}
