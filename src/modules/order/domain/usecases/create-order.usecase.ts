import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderModel, OrderModelContract, OrderModelInput } from '../order';
import { OrderRepositoryContract } from '../persistence/order.repository';

type Input = OrderModelInput;
type Output = OrderModelContract;

export class CreateOrderService implements BaseUseCaseContract<Input, Output> {
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(dto: Input): Promise<Output> {
    const order = OrderModel.create(dto);
    return await this.repository.createOne(order);
  }
}

// export const createOrderService = (
//   repository: OrderRepositoryContract,
// ): CreateOrderService => {
//   if (!repository || typeof repository.createOne !== 'function') {
//     throw new Error('Invalid repository provided');
//   }
//   return new CreateOrderService(repository);
// };
