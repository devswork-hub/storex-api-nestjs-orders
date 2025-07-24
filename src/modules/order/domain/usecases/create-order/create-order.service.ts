import { BaseUseCaseContract } from '../../../../../shared/domain/base/usecase.base';
import { OrderModel, OrderModelContract } from '../../order';
import { CreateOrderInput } from './create-order.input';
import { DomainEventType } from '@/src/shared/domain/events/domain-event';
import { OrderReadableRepositoryContract } from '../../../application/persistence/order.readable-respository';
import { EntityManager } from 'typeorm';

type Input = CreateOrderInput;
type Output = { order: OrderModelContract; events: DomainEventType[] };

export class CreateOrderService
  implements BaseUseCaseContract<CreateOrderInput, Output>
{
  constructor(private readonly repository: OrderReadableRepositoryContract) {}

  async execute(dto: Input, manager?: EntityManager): Promise<Output> {
    const entity = OrderModel.create(dto);
    await this.repository.createOne(entity, manager);
    const events = entity.pullDomainEvents();

    return {
      order: entity.toContract(),
      events,
    };
  }
}
