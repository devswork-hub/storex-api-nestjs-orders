import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderGraphQLInput } from '../../graphql/inputs/order.inputs';
import { CreateOrderService } from '../../../domain/usecases/create-order/create-order.service';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { CreateOrderValidation } from '../../../domain/usecases/create-order/create-order.validation';
import { OrderMapper } from '../../order.mapper';
import { OrderCreatedEvent } from '../events/order-created.event-handler';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { CacheService } from '@/src/app/persistence/cache/cache.service';

export class CreateOrderCommand {
  constructor(public readonly data: CreateOrderGraphQLInput) {}
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly eventBus: EventBus,
    private readonly cacheService: CacheService,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderOuput> {
    const { data } = command;
    const validations = new CreateOrderValidation();
    validations.validate(data);

    const domainInput = OrderMapper.toDomainInput(data);
    const created = await this.createOrderService.execute(domainInput);
    this.eventBus.publish(new OrderCreatedEvent(created.id, created as any));
    await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);
    return OrderMapper.fromEntitytoGraphQLOrderOutput(created);
  }
}
