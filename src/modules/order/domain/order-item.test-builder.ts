import { TestDataBuilder } from '@/shared/testing/test-data-builder';
import { OrderItemModelContract } from './order-item';

export class OrderItemTestBuilder extends TestDataBuilder<OrderItemModelContract> {}

export const orderItemTestBuilder = new OrderItemTestBuilder()
  .with('active', true)
  .with('createdAt', new Date())
  .with('deletedAt', new Date())
  .with('updatedAt', new Date())
  .build();
