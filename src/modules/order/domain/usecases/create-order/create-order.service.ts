import { BaseUseCaseContract } from '../../../../../shared/domain/base/usecase.base';
import { OrderModel, OrderModelContract } from '../../order';
import { CreateOrderInput } from './create-order.input';
import { DomainEventType } from '@/shared/domain/events/domain-event';
import { OrderReadableRepositoryContract } from '../../../application/persistence/order.readable-respository';

type Input = CreateOrderInput;
type Output = { order: OrderModelContract; events: DomainEventType[] };

export class CreateOrderService
  implements BaseUseCaseContract<CreateOrderInput, Output>
{
  constructor(private readonly repository: OrderReadableRepositoryContract) {}

  async execute(dto: Input): Promise<Output> {
    const entity = OrderModel.create(dto);
    await this.repository.createOne(entity);
    const events = entity.pullDomainEvents();

    return {
      order: entity.toContract(),
      events,
    };
  }
}
