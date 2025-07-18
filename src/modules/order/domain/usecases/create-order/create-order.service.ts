import { BaseUseCaseContract } from '../../../../../shared/domain/base/usecase.base';
import { OrderRepositoryContract } from '../../persistence/order.repository';
import { OrderModel, OrderModelContract } from '../../order';
import { CreateOrderInput } from './create-order.input';
import { DomainEventType } from '@/src/shared/domain/events/domain-event';

type Input = CreateOrderInput;
type Output = { order: OrderModelContract; events: DomainEventType[] };

export class CreateOrderService
  implements BaseUseCaseContract<CreateOrderInput, Output>
{
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(dto: Input): Promise<Output> {
    const entity = OrderModel.create(dto);
    await this.repository.createOne(entity);
    const events = entity.pullDomainEvents();

    return {
      order: entity,
      events,
    };
  }
}
