import {
  ReadableRepositoryContract,
  WritableRepositoryContract,
} from '@/shared/domain/base/repository.contract.base';
import { OrderModelContract, OrderModelInput } from '../../domain/order';
import { EntityManager } from 'typeorm';

export type OrderReadableRepositoryContract = {
  findBy(
    query: Partial<OrderModelContract>,
    order?: { field: string; direction: 'asc' | 'desc' },
  ): Promise<OrderModelContract[]>;
} & ReadableRepositoryContract<OrderModelContract>;

export type OrderWritableRepositoryContract = {
  createOne(order: OrderModelContract): Promise<void>;
  createOneWithTransaction?(
    order: OrderModelContract,
    manager: EntityManager,
  ): Promise<void>;
  update: (order: OrderModelInput) => Promise<void>;
  setTransactionManager?(manager: EntityManager): void; // método opcional para contexto
  findById?: (id: string) => Promise<OrderModelContract | null>;
} & WritableRepositoryContract<OrderModelContract>;
