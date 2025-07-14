import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderGraphQLInput } from '../../graphql/inputs/order.inputs';
import { CreateOrderService } from '../../../domain/usecases/create-order/create-order.service';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { CreateOrderValidation } from '../../../domain/usecases/create-order/create-order.validation';
import { OrderMapper } from '../../order.mapper';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { CacheService } from '@/src/app/persistence/cache/cache.service';
import { OrderCreatedEvent } from '../events/order-created.event-handler';
import { OrderModel } from '../../../domain/order';
// import { InjectConnection } from '@nestjs/mongoose';
// import { Connection } from 'mongoose';
// import { OutboxRepository } from '@/src/app/persistence/outbox/outbox-repository';
// import { ConfigValues } from '@/src/app/config/config.values';

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
    // private readonly outboxRepository: OutboxRepository,
    // @InjectConnection() private readonly connection: Connection,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderOuput> {
    this.executeValidations(command);
    const domainInput = OrderMapper.toDomainInput(command.data);
    const created = await this.createOrderService.execute(domainInput);

    /**
     * TODO: envio temporario, pra eu testar se de fato eu capturo no events-handler.ts
     */
    // this.eventBus.publish(new OrderCreatedEvent(created.id, created as any));

    // IGNORAR
    // const domainEvents = order.pullDomainEvents(); // extrai os eventos
    // // Para cada evento, salva na coleção outbox
    // for (const event of domainEvents) {
    //   await this.outboxRepository.save(
    //     {
    //       aggregateId: order.id,
    //       eventType: event.constructor.name,
    //       payload: event,
    //       occurredAt: new Date(),
    //     },
    //     session,
    //   );
    // }

    // const pendingEvents = await outboxRepository.findPending();
    // for (const event of pendingEvents) {
    //   await rabbitMQPublisher.publish(event.eventType, event.payload);
    //   await outboxRepository.markAsProcessed(event.id); // marca como enviado
    // }

    new OrderModel(created)
      .pullDomainEvents()
      .forEach((event) => this.eventBus.publish(event));

    await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);
    return OrderMapper.fromEntitytoGraphQLOrderOutput(created);

    // TODO: Isso funciona! Tem so que adicionar o suporte ao Replicaset do Mongo no Docker Compose
    // this.executeValidations(command);
    // const session = await this.connection.startSession();
    // session.startTransaction();
    // try {
    //   const domainInput = OrderMapper.toDomainInput(command.data);
    //   const created = await this.createOrderService.execute(domainInput);
    //   await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);
    //   await this.outboxRepository.save(
    //     {
    //       aggregateId: 'Order',
    //       aggregateType: created.id.toString(),
    //       eventType: 'OrderCreated',
    //       payload: created,
    //     },
    //     session,
    //   );
    //   await session.commitTransaction();
    //   return OrderMapper.fromEntitytoGraphQLOrderOutput(created);
    // } catch (error) {
    //   await session.abortTransaction();
    //   throw error;
    // } finally {
    //   session.endSession();
    // }
  }

  private executeValidations(command: CreateOrderCommand) {
    const { data } = command;
    const validations = new CreateOrderValidation();
    validations.validate(data);
  }
}

// @EventsHandler(OrderCompletedDomainEvent)
// export class OrderCompletedHandler
//   implements IEventHandler<OrderCompletedDomainEvent>
// {
//   constructor(private readonly publisher: RabbitMQPublisherService) {}

//   async handle(event: OrderCompletedDomainEvent) {
//     const integrationEvent = new OrderCompletedIntegrationEvent(event.orderId);
//     await this.publisher.publish('order.completed', integrationEvent);
//   }
// }
