import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderModel, OrderModelContract, OrderModelInput } from '../order';
import { OrderRepositoryContract } from '../persistence/order.repository';
import { CreateOrderValidation } from './create-category/create-order.validation';

type Input = OrderModelInput;
type Output = OrderModelContract;

export class CreateOrderService implements BaseUseCaseContract<Input, Output> {
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(dto: Input): Promise<Output> {
    try {
      // const validations = new CreateOrderValidation();
      // validations.validate(dto);
      const order = OrderModel.create(dto);
      return await this.repository.createOne(order);
    } catch (error) {
      throw new Error(
        JSON.stringify({
          message: 'Failed to create order',
          cause: error,
          stack: error.stack,
          name: error.name,
        }),
      );
    }
  }
}
