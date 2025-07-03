import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderGraphQLInput } from '../../graphql/inputs/order.inputs';
import { CreateOrderService } from '../../../domain/usecases/create-order/create-order.service';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { CreateOrderValidation } from '../../../domain/usecases/create-order/create-order.validation';
import { OrderMapper } from '../../order.mapper';
import { OrderCreatedEvent } from '../events/created-order.event-handler';

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
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderOuput> {
    const { data } = command;
    const validations = new CreateOrderValidation();
    validations.validate(data);

    const domainInput = OrderMapper.toDomainInput(data);
    const created = await this.createOrderService.execute(domainInput);
    this.eventBus.publish(new OrderCreatedEvent(created.id, created));
    return OrderMapper.fromEntitytoGraphQLOrderOutput(created);
  }
}
