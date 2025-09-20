import { BaseUseCaseContract } from '@/shared/domain/base/usecase.base';
import { OrderID } from '../../order-id';
import { OrderModel, OrderModelContract } from '../../order';
import { OrderWritableRepositoryContract } from '@/modules/order/application/persistence/order.respository';
import { DomainEventType } from '@/shared/domain/events/domain-event';

type Output = { order: OrderModelContract; events: DomainEventType[] };

export class DeleteOrderService
  implements BaseUseCaseContract<OrderID, Output>
{
  constructor(private readonly repo: OrderWritableRepositoryContract) {}

  async execute(id: OrderID): Promise<Output> {
    const foundOrder = await this.repo.findById(id.getValue());
    if (!foundOrder) throw new Error(`Order with id ${id} not found`);

    // Não usa .create (isso é só para novos pedidos)
    const order = OrderModel.restore(foundOrder); // ou OrderModel.restore(foundedOrder) se criar um método

    order.markAsDeleted(new OrderID(order.id));
    await this.repo.update(order.toContract()); // usa o contrato atualizado

    const events = order.pullDomainEvents();

    return {
      order: order.toContract(),
      events,
    };
  }
}
