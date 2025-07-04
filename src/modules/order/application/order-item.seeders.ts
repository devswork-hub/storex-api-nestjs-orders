import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderItemSubdocument } from './mongo/documents/order-item.document';

@Injectable()
export class OrderItemSeeder {
  constructor(
    @InjectModel(OrderItemSubdocument.name)
    private readonly orderItemModel: Model<OrderItemSubdocument>,
  ) {}

  async seed() {
    const count = await this.orderItemModel.countDocuments();
    if (count === 0) {
      await this.orderItemModel.insertMany([
        { productId: 'prod-001', quantity: 2, price: 49.99 },
        { productId: 'prod-002', quantity: 1, price: 99.9 },
        { productId: 'prod-003', quantity: 3, price: 19.5 },
      ]);
      console.log('Seeded order items!');
    } else {
      console.log('Order items already exist, skipping seed.');
    }
  }
}
