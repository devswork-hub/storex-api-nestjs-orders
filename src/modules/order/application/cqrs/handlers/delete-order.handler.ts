// delete-order.command-handler.ts

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { OrderID } from '../../../domain/order-id';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';
import { OutboxTypeORMService } from '@/app/persistence/outbox/typeorm/outbox-typeorm.service';
import { OrderWritableRepositoryContract } from '../../persistence/order.respository';
import { TypeORMUnitOfWork } from '@/app/persistence/typeorm/typeorm-uow.service';
import { DeleteOrderService } from '@/modules/order/domain/usecases/delete-order/delete-order.service';
import { CacheService } from '@/app/persistence/cache/cache.service';
import { OutboxDomainEventPublisher } from '@/app/persistence/outbox/outbox-domain-events.publisher';

export class DeleteOrderCommand {
  constructor(public readonly orderId: OrderID) {}
}

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderCommandHandler
  implements ICommandHandler<DeleteOrderCommand>
{
  private readonly logger = new Logger(DeleteOrderCommandHandler.name);

  constructor(
    @Inject('OrderWritableRepositoryContract')
    private readonly repo: OrderWritableRepositoryContract,
    private readonly deleteOrderUseCase: DeleteOrderService,
    private readonly uow: TypeORMUnitOfWork,
    private readonly outboxEventPublisher: OutboxDomainEventPublisher,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<boolean> {
    this.logger.log(
      `Iniciando a deleção do pedido: ${command.orderId.getValue()}`,
    );

    try {
      await this.uow.startTransaction(async (manager) => {
        this.repo.setTransactionManager(manager);

        const { events } = await this.deleteOrderUseCase.execute(
          command.orderId,
        );

        await this.outboxEventPublisher.publishAll(events, manager);
      });

      this.logger.log(
        `Pedido ${command.orderId.getValue()} deletado com sucesso. Caches invalidados.`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Falha ao deletar o pedido: ${command.orderId.getValue()}`,
        error.stack,
      );
      throw error; // Re-lança o erro para o GraphQL
    }
  }
}
