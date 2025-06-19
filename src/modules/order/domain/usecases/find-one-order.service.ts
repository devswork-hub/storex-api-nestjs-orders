import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderModelContract } from '../order';
import { OrderRepositoryContract } from '../persistence/order.repository';

type Input = string;
type Output = OrderModelContract;

export class FindOneOrderService implements BaseUseCaseContract<Input, Output> {
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(id: string): Promise<Output> {
    const order = await this.repository.findById(id);
    if (!order) throw new Error(`Order with id ${id} not found`);
    return order;
  }
}
