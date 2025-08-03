import { BaseUseCaseContract } from '@/shared/domain/base/usecase.base';
import { OrderRepositoryContract } from '../../persistence/order.repository';
import { OrderID } from '../../order-id';
import { OrderModel } from '../../order';
import { OrderMongoMapper } from '../../../application/mongo/order-mongo.mapper';
import { GraphQLError } from 'graphql';

export class DeleteOrderService implements BaseUseCaseContract<OrderID, void> {
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(id: OrderID): Promise<void> {
    /**
     * O retorno de findById já traz os itens como instâncias de OrderItemModel,
     * já construídas (ex: via OrderMongoMapper.fromPersistence() ou similar).
     *
     * Resultado: ao fazer new OrderItemModel(item) dentro do create, o construtor
     * interno pode estar esperando propriedades puras (price, quantity, etc.), mas
     * está recebendo métodos e estrutura interna de uma instância — o que leva a erros como:
     * - campos undefined
     * - chamada de métodos que não existem
     * - falhas de validação (como o validateCurrencyEntry())
     */
    const order = await this.repository.findById(id.getValue());
    if (!order)
      throw new GraphQLError(`Order with id ${id} not found`, {
        extensions: {
          code: 'NOT_FOUND',
          domain: 'Order',
        },
      });

    const orderDomain = OrderModel.create({ ...order });
    orderDomain.softDelete();
    await this.repository.update({
      ...orderDomain,
      id: id.getValue(),
    });
  }
}
