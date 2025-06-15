import { InMemoryBaseRepository } from 'src/shared/domain/base/in-memory-repository.base';
import { OrderRepositoryContract } from './order.repository';
import { OrderModelContract } from './order';

export class OrderInMemoryRepository
  extends InMemoryBaseRepository<OrderModelContract>
  implements OrderRepositoryContract {}
