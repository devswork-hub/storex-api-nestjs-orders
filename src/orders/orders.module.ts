import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItemSchema } from './api/order-item.schema';
import { OrderService } from './api/order.service';
import { OrderItemResolver } from './api/order.resolver';
import { OrderItemSeeder } from './api/order-item.seeders';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'OrderItem', schema: OrderItemSchema }]),
  ],
  providers: [OrderService, OrderItemResolver, OrderItemSeeder],
  exports: [OrderItemSeeder],
})
export class OrdersModule {}
