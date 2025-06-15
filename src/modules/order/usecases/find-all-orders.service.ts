import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderModelContract } from '../order';
import { OrderRepositoryContract } from '../persistence/order.repository';

export class FindAllOrderService
  implements BaseUseCaseContract<void, OrderModelContract[]>
{
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(): Promise<OrderModelContract[]> {
    return await this.repository.findAll();
  }
}
