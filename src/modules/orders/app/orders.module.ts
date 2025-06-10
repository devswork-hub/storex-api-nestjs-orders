import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItemSchema } from './api/graphql/order-item.schema';
import { OrderService } from './api/order.service';
import { OrderItemResolver } from './api/graphql/order.resolver';
import { OrderItemSeeder } from './api/order-item.seeders';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'OrderItem', schema: OrderItemSchema }]),
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
