import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItemSchema } from '../../modules/orders/api/graphql/order-item.schema';
import { OrderItemResolver } from '../../modules/orders/api/graphql/order.resolver';
import { OrderItemSeeder } from '../../modules/orders/api/order-item.seeders';
import { OrderService } from '../../modules/orders/api/order.service';
import {
  OrderMongoSchema,
  OrderSchema,
} from 'src/modules/orders/api/mongo/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'OrderItem', schema: OrderItemSchema },
      {
        name: 'OrderMongoSchema',
        schema: OrderSchema,
      },
    ]),
  ],
  providers: [OrderService, OrderItemResolver, OrderItemSeeder],
  exports: [OrderItemSeeder],
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
