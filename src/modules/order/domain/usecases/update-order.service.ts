import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderModel, OrderModelInput } from '../order';
import { OrderRepositoryContract } from '../persistence/order.repository';

type Input = { id: string; data: OrderModelInput };
type Output = void;

export class UpdateOrderService implements BaseUseCaseContract<Input, Output> {
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute({ id, data }: Input): Promise<void> {
    const current = await this.repository.findById(id);
    if (!current) {
      throw new Error(`Order with id ${id} not found`);
    }

    const updated = OrderModel.create({
      ...data,
      // garantir que atributos imutáveis sejam preservados
      id: current.id,
    });

    await this.repository.update(updated);
  }
}
