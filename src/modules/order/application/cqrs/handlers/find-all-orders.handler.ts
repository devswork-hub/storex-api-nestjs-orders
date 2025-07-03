import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindAllOrderService } from '../../../domain/usecases/find-all-order.service';
import { OrderOuput } from '../../graphql/outputs/order.output';
import { OrderMapper } from '../../order.mapper';

export class FindAllOrdersQuery {}

@QueryHandler(FindAllOrdersQuery)
export class FindAllOrdersHandler
  implements IQueryHandler<FindAllOrdersQuery, OrderOuput[]>
{
  constructor(private readonly findAllOrdersService: FindAllOrderService) {}

  async execute(): Promise<OrderOuput[]> {
    const orders = await this.findAllOrdersService.execute(); // Seu serviço já retorna a lista
    return orders.map((order) =>
      OrderMapper.fromEntitytoGraphQLOrderOutput(order),
    );
  }
}
