import { InMemoryBaseRepository } from 'src/shared/domain/base/in-memory-repository.base';
import { OrderModelContract } from '../order';
import { OrderRepositoryContract } from './order.repository';

export class OrderInMemoryRepository
  extends InMemoryBaseRepository<OrderModelContract>
  implements OrderRepositoryContract {}
