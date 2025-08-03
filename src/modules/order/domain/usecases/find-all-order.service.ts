import { BaseUseCaseContract } from '@/shared/domain/base/usecase.base';
import { OrderModelContract } from '../order';
import { OrderRepositoryContract } from '../persistence/order.repository';

type Output = OrderModelContract[];

export class FindAllOrderService implements BaseUseCaseContract<void, Output> {
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(): Promise<Output> {
    return await this.repository.findBy(
      { active: true, deleted: false },
      { field: 'createdAt', direction: 'desc' },
    );
  }
}
