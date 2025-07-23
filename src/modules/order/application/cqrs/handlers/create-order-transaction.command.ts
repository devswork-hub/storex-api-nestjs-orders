import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderGraphQLInput } from '../../graphql/inputs/order.inputs';
import { CreateOrderService } from '../../../domain/usecases/create-order/create-order.service';
import { CreateOrderValidation } from '../../../domain/usecases/create-order/create-order.validation';
import { OrderMapper } from '../../order.mapper';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { CacheService } from '../../../../../app/persistence/cache/cache.service';
import { OutboxTypeORMService } from '@/src/app/persistence/outbox/typeorm/outbox-typeorm.service';
import { TypeORMUnitOfWork } from '@/src/app/persistence/typeorm/typeorm-uow.service';

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
  ) {}

  async execute(command: CreateOrderCommand): Promise<any> {
    this.executeValidations(command);

    await this.uow.startTransaction();

    try {
      const domainInput = OrderMapper.toDomainInput(command.data);
      const { order, events } =
        await this.createOrderService.execute(domainInput);
      await this.cacheService.delete(ORDER_CACHE_KEYS.FIND_ALL);

      for (const event of events) {
        /**
         * Usamos o `queryRunner.manager` aqui para garantir que o repositório usado esteja
         * dentro da mesma transação aberta pelo QueryRunner.
         * Isso é essencial para garantir consistência entre a criação do pedido
         * e o armazenamento do evento no Outbox.
         *
         * Se usássemos `this.outboxService.save(event)` diretamente (sem passar o manager),
         * o TypeORM usaria o EntityManager padrão, fora da transação,
         * o que poderia causar inconsistência caso ocorra rollback.
         *
         * ✅ Com `queryRunner.manager`, tanto a persistência do pedido quanto do evento
         * estarão no mesmo commit/rollback.
         */
        await this.outboxService.save(event, this.uow.getManager());
      }
      await this.uow.commitTransaction();
      return OrderMapper.fromEntitytoGraphQLOrderOutput(order);
    } catch (error) {
      await this.uow.rollbackTransaction();
      throw error;
    } finally {
      await this.uow.release();
    }
  }

  private executeValidations(command: CreateOrderCommand) {
    const { data } = command;
    const validations = new CreateOrderValidation();
    validations.validate(data);
  }
}
