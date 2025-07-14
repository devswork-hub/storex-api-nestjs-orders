import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderRepositoryContract } from '../../persistence/order.repository';
import { OrderModel, OrderModelContract } from '../../order';
import { CreateOrderInput } from './create-order.input';
import { ValidationException } from '@/src/shared/domain/validation/validation-exception';
import { DomainEventBus } from '@/src/shared/domain/events/domain-event-bus';

type Input = CreateOrderInput;
type Output = OrderModelContract;

export class CreateOrderService
  implements BaseUseCaseContract<CreateOrderInput, Output>
{
  constructor(
    private readonly domainEventBus: DomainEventBus,
    private readonly repository: OrderRepositoryContract,
  ) {}

  async execute(dto: Input): Promise<Output> {
    try {
      const order = OrderModel.create(dto);
      const createdOrder = await this.repository.createOne(order);
      const events = order.pullDomainEvents();
      this.domainEventBus.publishAll(events);
      return createdOrder;
    } catch (error) {
      if (error instanceof ValidationException) {
        throw new Error(
          JSON.stringify(error.errors, null, 2),
          // JSON.stringify({
          //   message: 'Validation failed',
          //   errors: error.errors, // aqui está o mapa de erros por campo
          // }),
        );
      }

      throw new Error(
        JSON.stringify({
          message: 'Failed to create order',
          cause: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : 'UnknownError',
        }),
      );
    }
  }
}
