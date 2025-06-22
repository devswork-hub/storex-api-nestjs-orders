import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderRepositoryContract } from '../../persistence/order.repository';
import { OrderID } from '../../order-id';
import { OrderModel } from '../../order';
import { OrderMongoMapper } from '../../../application/mongo/order-mongo.mapper';

export class DeleteOrderService implements BaseUseCaseContract<OrderID, void> {
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(id: OrderID): Promise<void> {
    const existing = await this.repository.findById(id.getValue());
    const order = OrderMongoMapper.fromPersistence(existing);

    if (!order) throw new Error(`Order with id ${id} not found`);

    const updatedCategory = OrderModel.create({ ...order });
    updatedCategory.softDelete();
    await this.repository.update({
      ...updatedCategory,
      id: id.getValue(),
    });
  }
}
