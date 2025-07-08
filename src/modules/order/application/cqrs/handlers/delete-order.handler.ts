import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OrderMongoRepository } from '../../order.mongo-repository';
import { Inject } from '@nestjs/common';
import { OrderID } from '../../../domain/order-id';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ORDER_CACHE_KEYS } from '../../orders-cache-keys';

export class DeleteOrderCommand {
  constructor(public readonly orderId: OrderID) {}
}

@CommandHandler(DeleteOrderCommand)
export class DeleteOrderCommandHandler
  implements ICommandHandler<DeleteOrderCommand>
{
  constructor(
    private readonly repo: OrderMongoRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async execute(command: DeleteOrderCommand): Promise<boolean> {
    await this.repo.delete(command.orderId.getValue()); // Ou o método que você usa para deletar
    // Invalida o cache de "todos os pedidos"
    await this.cacheManager.del(ORDER_CACHE_KEYS.FIND_ALL);
    // Invalida o cache do pedido específico
    await this.cacheManager.del(`order_${command.orderId.getValue()}`);
    console.log(
      `Caches de pedido ${command.orderId.getValue()} e "all_orders" invalidados.`,
    );
    return true;
  }
}
