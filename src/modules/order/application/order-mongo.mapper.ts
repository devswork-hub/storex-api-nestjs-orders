import { OrderModelContract } from '../domain/order';
import { OrderMongoEntityProps } from './mongo/documents/order.document';

export class OrderMongoEntityMapper {
  static toDomain(document: OrderMongoEntityProps): OrderModelContract {
    return null;
  }

  static toPersistence(entity: OrderModelContract): OrderMongoEntityProps {
    return null;
  }
}
