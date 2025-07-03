import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { OrderModelContract } from '@/src/modules/order/domain/order';
import { FindOneOrderService } from '@/src/modules/order/domain/usecases/find-one-order.service';
import { OrderID } from '@/src/modules/order/domain/order-id';

export class FindOrderByIdQuery {
  constructor(public readonly id: string) {}
}

@QueryHandler(FindOrderByIdQuery)
export class FindOrderByIdHandler
  implements IQueryHandler<FindOrderByIdQuery, OrderModelContract | null>
{
  constructor(private readonly findOneOrderService: FindOneOrderService) {}

  async execute(query: FindOrderByIdQuery): Promise<OrderModelContract | null> {
    const { id } = query;
    const order = await this.findOneOrderService.execute(new OrderID(id));
    return order ? order : null;
  }
}
