import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderItemSchema } from './api/order-item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'OrderItem', schema: OrderItemSchema }]),
  ],
  providers: [],
})
export class OrdersModule {}
