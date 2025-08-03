import { OutboxTypeORMEntity } from '../outbox/typeorm/outbox-typeorm.entity';
import { orderTypeormEntities } from '@/modules/order/application/persistence/typeorm/entities';

export const typeormEnties = [OutboxTypeORMEntity, ...orderTypeormEntities];
