import { BaseRepositoryContract } from './repository.contract.base';

type StubModel = Record<string, any>;

export class InMemoryBaseRepository<M extends StubModel>
  implements BaseRepositoryContract<M>
{
  public items: M[] = [];

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

  async findOneBy(query: Partial<M>): Promise<M> {
    return this.items.find((item) => {
      return Object.entries(query).every(([key, value]) => item[key] === value);
    });
  }

  async findBy(
    query: Partial<M>,
    order?: { field: string; direction: 'asc' | 'desc' },
  ): Promise<M[]> {
    let items = this.items.filter((item) => {
      return Object.entries(query).every(([key, value]) => item[key] === value);
    });

    if (order) {
      items = items.sort((a, b) => {
        const aValue = a[order.field];
        const bValue = b[order.field];
        if (aValue < bValue) {
          return order.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return order.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return items.map(this.clone);
  }

  clone(obj: M): M {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  }
}
