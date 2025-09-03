import { EventSubscriber, DataSource } from 'typeorm';
import { OrderTypeORMEntity } from './entities/order.entity';
import { BaseLogSubscriber } from '@/app/persistence/typeorm/subscriber';

@EventSubscriber()
export class PedidoSubscriber extends BaseLogSubscriber<OrderTypeORMEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource);
  }

  listenTo() {
    return OrderTypeORMEntity;
  }
}
