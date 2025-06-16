import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderInMemoryRepository } from '@/src/modules/order/persistence/order.in-memory.repository';
import { OrderMongoRepository } from '@/src/modules/order/application/order.mongo-repository';
import { FindAllOrderService } from '@/src/modules/order/usecases/find-all-orders.service';
import { OrderRepositoryContract } from '@/src/modules/order/persistence/order.repository';
import { OrderService } from '@/src/modules/order/application/order.service';
import { OrderItemResolver } from '@/src/modules/order/application/graphql/order.resolver';
import { OrderItemSeeder } from '@/src/modules/order/application/order-item.seeders';
import { OrderItemSchema } from '@/src/modules/order/application/graphql/order-item.schema';
import {
  OrderMongoSchema,
  OrderSchema,
} from '@/src/modules/order/application/mongo/order.schema';
import { CreateOrderService } from '@/src/modules/order/usecases/create-order.usecase';
import { orderProviders } from './order.providers';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OrderItem', schema: OrderItemSchema },
      {
        name: OrderMongoSchema.name,
        schema: OrderSchema,
      },
    ]),
  ],
  providers: [
    ...orderProviders,
    OrderService,
    OrderItemResolver,
    OrderItemSeeder,
    OrderMongoRepository,
    FindAllOrderService,
    {
      provide: OrderInMemoryRepository,
      useClass: OrderMongoRepository,
    },
    {
      provide: FindAllOrderService,
      useFactory: (repo: OrderRepositoryContract) => {
        return new FindAllOrderService(repo);
      },
      inject: [OrderMongoRepository],
    },
    {
      provide: CreateOrderService,
      useFactory: (repo: OrderRepositoryContract) =>
        new CreateOrderService(repo),
      inject: [OrderMongoRepository],
    },
  ],
  exports: [...orderProviders],
})
export class OrdersModule {}

// orders
//   - app
//     - api
//       - graphql
//         - order-item.schema.ts
//         - order.resolver.ts
//       - order.service.ts
//       - order-item.seeders.ts
//   - core
//     - order-item.interface.ts
//     - order-item.model.ts
