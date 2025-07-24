import { OrderTypeORMEntity } from '@/src/modules/order/application/persistence/typeorm/entities/order.entity';
import { OutboxTypeORMEntity } from '../outbox/typeorm/outbox-typeorm.entity';
import { OrderItemTypeORMEntity } from '@/src/modules/order/application/persistence/typeorm/entities/order-item.entity';

export const typeormEnties = [
  OutboxTypeORMEntity,
  OrderTypeORMEntity,
  OrderItemTypeORMEntity,
];
