import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderGraphQLInput } from '../../graphql/inputs/order.inputs';
import { CreateOrderService } from '../../../domain/usecases/create-order/create-order.service';
import { CreateOrderValidation } from '../../../domain/usecases/create-order/create-order.validation';
import { OrderMapper } from '../../order.mapper';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { CacheService } from '../../../../../app/persistence/cache/cache.service';
import { OutboxTypeORMService } from '@/src/app/persistence/outbox/typeorm/outbox-typeorm.service';
import { TypeORMUnitOfWork } from '@/src/app/persistence/typeorm/typeorm-uow.service';
import { OrderTypeORMRepository } from '../../persistence/typeorm/order.typeorm-repository';
import { Inject } from '@nestjs/common';

export class CreateOrderCommand {
  constructor(public readonly data: CreateOrderGraphQLInput) {}
}

@CommandHandler(CreateOrderCommand)
export class CreateOrderTransactionCommandHandler
  implements ICommandHandler<CreateOrderCommand>
{
  constructor(
    private readonly createOrderService: CreateOrderService,
    private readonly cacheService: CacheService,
    private readonly outboxService: OutboxTypeORMService,
    private readonly uow: TypeORMUnitOfWork,
    /**
     * Usando o inject, pra nao precisar declarar todos os providers explicitamente na useFactory na injecao dos providers
     */
    @Inject('OrderReadableRepositoryContract')
    private readonly orderRepository: OrderTypeORMRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<any> {
    this.executeValidations(command);
    // Passar o manager garante que tanto o insert do pedido quanto o save do outbox aconteçam na mesma transação.
    return await this.uow.startTransaction(async (manager) => {
      // Se eu remover o setTransactionManager, o repositório não vai usar o manager da transação atual, e sim o padrão do TypeORM.
      // Logo, o pedido e o outbox não vão ser salvos na mesma transação, podendo gerar inconsistências.
      this.orderRepository.setTransactionManager(manager);

      const domainInput = OrderMapper.toDomainInput(command.data);
      // Se não passar o manager, o TypeORM vai criar uma nova conexão para o repositório e não vai respeitar a transação atual, abrindo risco de inconsistência.
      const { order, events } =
        await this.createOrderService.execute(domainInput);

      await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);

      for (const event of events) {
        await this.outboxService.save(event, manager);
      }
      return OrderMapper.fromEntitytoGraphQLOrderOutput(order);
    });
  }

  private executeValidations(command: CreateOrderCommand) {
    const { data } = command;
    const validations = new CreateOrderValidation();
    validations.validate(data);
  }
}
