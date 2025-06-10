import { RepositoryContract } from './interfaces/repository.interface';

export class InMemoryBaseRepository<M extends Record<string, any>>
  implements RepositoryContract<M>
{
  items: M[] = [];

  async createOne(entity: M): Promise<M> {
    this.items.push(entity);
    return entity;
  }

  async createMany(entities: M[]): Promise<M[]> {
    this.items.push(...entities);
    return this.items.filter((item) =>
      entities.some((entity) => entity.id === item.id),
    );
  }

  async update(entity: M): Promise<void> {
    const index = this.items.findIndex((item) => item.id === entity.id);
    if (index !== -1) {
      this.items[index] = entity;
    }
  }

  async delete(entityId: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id === entityId);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  async findById(entityId: string): Promise<M | undefined> {
    return this.items.find((item) => item.id === entityId);
  }

  async findAll(): Promise<M[]> {
    return [...this.items];
  }
}
