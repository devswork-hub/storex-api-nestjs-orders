import { BaseUseCaseContract } from '@/shared/domain/base/usecase.base';
import { OrderModelContract } from '../order';
import { OrderID } from '../order-id';
import { OrderReadableRepositoryContract } from '../../application/persistence/order.respository';

type Output = OrderModelContract;

export class FindOneOrderService
  implements BaseUseCaseContract<OrderID, Output>
{
  constructor(private readonly repository: OrderReadableRepositoryContract) {}

  async execute(id: OrderID): Promise<Output> {
    const order = await this.repository.findById(id.getValue());
    if (!order) throw new Error(`Order with id ${id.getValue()} not found`);
    return order;
  }
}
