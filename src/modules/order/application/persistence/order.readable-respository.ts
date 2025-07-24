import { BaseRepositoryContract } from 'src/shared/domain/base/repository.contract.base';
import { OrderModelContract, OrderModelInput } from '../../domain/order';
import { EntityManager } from 'typeorm';

export type OrderReadableRepositoryContract = {
  createOne(order: OrderModelContract, manager?: EntityManager): Promise<void>;
  update: (order: OrderModelInput) => Promise<void>;
  setTransactionManager?(manager: EntityManager): void; // método opcional para contexto
} & Pick<BaseRepositoryContract<OrderModelContract>, 'createMany' | 'delete'>;
