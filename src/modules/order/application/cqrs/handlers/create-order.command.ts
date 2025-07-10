import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderGraphQLInput } from '../../graphql/inputs/order.inputs';
import { CreateOrderService } from '../../../domain/usecases/create-order/create-order.service';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { CreateOrderValidation } from '../../../domain/usecases/create-order/create-order.validation';
import { OrderMapper } from '../../order.mapper';
import { OrderCreatedEvent } from '../events/order-created.event-handler';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { CacheService } from '@/src/app/persistence/cache/cache.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  OutboxDocument,
  OutboxEntity,
} from '../../mongo/documents/outbox.document';
import { Connection, Model } from 'mongoose';

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
    @InjectModel(OutboxEntity.name) private outbox: Model<OutboxDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderOuput> {
    this.executeValidations(command);

    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const domainInput = OrderMapper.toDomainInput(command.data);
      const created = await this.createOrderService.execute(domainInput);
      // this.eventBus.publish(new OrderCreatedEvent(created.id, created as any));
      await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);

      const outboxEntity = new this.outbox({
        aggregateId: 'Order',
        aggregateType: created.id.toString(),
        eventType: 'OrderCreated',
        payload: created,
      });
      await outboxEntity.save({ session });

      // Confirmar a transação
      await session.commitTransaction();

      return OrderMapper.fromEntitytoGraphQLOrderOutput(created);
    } catch (error) {
      // Em caso de erro, abortar a transação
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private executeValidations(command: CreateOrderCommand) {
    const { data } = command;
    const validations = new CreateOrderValidation();
    validations.validate(data);
  }
}
