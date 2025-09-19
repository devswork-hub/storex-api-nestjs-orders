import { BaseUseCaseContract } from '@/shared/domain/base/usecase.base';
import { OrderModel, OrderModelContract } from '../order';
import { OrderReadableRepositoryContract } from '../../application/persistence/order.respository';

type Output = OrderModelContract[];

export class FindAllOrderService implements BaseUseCaseContract<void, Output> {
  constructor(private readonly repository: OrderReadableRepositoryContract) {}

  async execute(): Promise<Output> {
    return await this.repository
      .findBy(
        { active: true, deleted: false },
        { field: 'createdAt', direction: 'desc' },
      )
      .then((item) => item.map((i) => OrderModel.create(i).toContract()));
  }
}
