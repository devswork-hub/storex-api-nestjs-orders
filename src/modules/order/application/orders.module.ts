// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { OrderMongoRepository } from '@/src/modules/order/application/order.mongo-repository';
// import { OrderService } from '@/src/modules/order/application/order.service';
// import { OrderItemSeeder } from '@/src/modules/order/application/order-item.seeders';
// import { OrderItemSchema } from '@/src/modules/order/application/graphql/schemas/order-item.schema';
// import {
//   OrderMongoSchema,
//   OrderSchema,
// } from '@/src/modules/order/application/mongo/order.schema.v2';
// import { orderProviders } from './order.providers';

import { Module, Provider } from '@nestjs/common';
import { OrderMongoRepository } from './order.mongo-repository';
import { UpdateOrderService } from '../domain/usecases/update-order.service';
import { FindOneOrderService } from '../domain/usecases/find-one-order.service';
import { FindAllOrderService } from '../domain/usecases/find-all-order.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderMongoEntity,
  OrderSchema,
} from './mongo/documents/order.document';
import { OrderResolver } from './graphql/order.resolver';
import { CreateOrderService } from '../domain/usecases/create-order/create-order.service';
import { DeleteOrderService } from '../domain/usecases/delete-order/delete-order.service';
import { DomainSeeders } from './domain.seeders';
import { OrdersSeeder } from './mongo/seeders/orders.seeder';
import { CqrsModule } from '@nestjs/cqrs';
import { RabbitMQPublisherService } from '@/src/app/shared/messaging/rabbitmq.publisher';
import { CommandHandlers, EventHandlers, QueryHandlers } from './cqrs/handlers';
import { OutboxEntity, OutboxSchema } from './mongo/documents/outbox.document';
// import { CacheModule } from '@/src/app/persistence/cache/cache.module';

export const OrderRepositoryProvider: Provider = {
  provide: 'OrderRepositoryContract',
  useClass: OrderMongoRepository,
};

export const OrderUseCasesProviders: Provider[] = [
  {
    provide: CreateOrderService,
    useFactory: (repo: any) => new CreateOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
  {
    provide: UpdateOrderService,
    useFactory: (repo: any) => new UpdateOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
  {
    provide: DeleteOrderService,
    useFactory: (repo: any) => new DeleteOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
  {
    provide: FindOneOrderService,
    useFactory: (repo: any) => new FindOneOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
  {
    provide: FindAllOrderService,
    useFactory: (repo: any) => new FindAllOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
];

@Module({
  imports: [
    // CacheModule,
    CqrsModule,
    MongooseModule.forFeature([
      {
        name: OrderMongoEntity.name,
        schema: OrderSchema,
      },
      {
        name: OutboxEntity.name,
        schema: OutboxSchema,
      },
    ]),
  ],
  providers: [
    RabbitMQPublisherService,
    ...CommandHandlers, // <- 👈 Aqui está o que faltava
    ...QueryHandlers,
    ...EventHandlers,
    CreateOrderService,
    FindAllOrderService,
    FindOneOrderService,
    OrderMongoRepository,
    OrderRepositoryProvider, // 'OrderRepositoryContract'
    ...OrderUseCasesProviders, // casos de uso usam 'OrderRepositoryContract' no inject
    OrderResolver,
    DomainSeeders,
    OrdersSeeder,
  ],
  exports: [OrderRepositoryProvider, ...OrderUseCasesProviders],
})
export class OrdersModule {}

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       {
//         name: OrderMongoEntity.name,
//         schema: OrderSchema,
//       },
//     ]),
//   ],
//   providers: [
//     OrderRepositoryProvider,
//     ...OrderUseCasesProviders,
//     ...orderProviders,
//     // OrderService,
//     // OrderItemResolver,
//     // OrderItemSeeder,
//     OrderResolver,
//     OrderMongoRepository,
//     FindAllOrderService,
//     // {
//     //   provide: OrderInMemoryRepository,
//     //   useClass: OrderMongoRepository,
//     // },
//     // {
//     //   provide: FindAllOrderService,
//     //   useFactory: (repo: OrderRepositoryContract) => {
//     //     return new FindAllOrderService(repo);
//     //   },
//     //   inject: [OrderMongoRepository],
//     // },
//     // {
//     //   provide: CreateOrderService,
//     //   useFactory: (repo: OrderRepositoryContract) =>
//     //     new CreateOrderService(repo),
//     //   inject: [OrderMongoRepository],
//     // },
//   ],
//   exports: [
//     OrderRepositoryProvider,
//     ...OrderUseCasesProviders,
//     ...orderProviders,
//   ],
// })
// export class OrdersModule {}

// // orders
// //   - app
// //     - api
// //       - graphql
// //         - order-item.schema.ts
// //         - order.resolver.ts
// //       - order.service.ts
// //       - order-item.seeders.ts
// //   - core
// //     - order-item.interface.ts
// //     - order-item.model.ts

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: OrderMongoEntity.name, schema: OrderSchema },
//     ]),
//   ],
//   providers: [OrderRepositoryProvider, ...OrderUseCasesProviders],
//   exports: [OrderRepositoryProvider, ...OrderUseCasesProviders],
// })
// export class OrdersModule {}
