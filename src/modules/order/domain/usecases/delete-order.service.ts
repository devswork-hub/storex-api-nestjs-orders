import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderRepositoryContract } from '../persistence/order.repository';

type Input = string;
type Output = void;

export class DeleteOrderService implements BaseUseCaseContract<Input, Output> {
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error(`Order with id ${id} not found`);
    }

    await this.repository.delete(id);
  }
}
