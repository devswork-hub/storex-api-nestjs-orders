import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderModelContract } from '../order';
import { OrderRepositoryContract } from '../persistence/order.repository';
import { OrderID } from '../order-id';

type Output = OrderModelContract;

export class FindOneOrderService
  implements BaseUseCaseContract<OrderID, Output>
{
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(id: OrderID): Promise<Output> {
    const order = await this.repository.findById(id.getValue());
    if (!order) throw new Error(`Order with id ${id.getValue()} not found`);
    return order;
  }
}
