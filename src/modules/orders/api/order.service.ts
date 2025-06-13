import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderItem } from './graphql/order-item.schema';
import { Injectable } from '@nestjs/common';
import { OrderMongoSchema } from './mongo/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('OrderMongoSchema')
    private readonly orderModel: Model<OrderMongoSchema>,
    @InjectModel('OrderItem') private readonly orderItemModel: Model<OrderItem>,
  ) {}

  async finAllOrdersTest(): Promise<OrderMongoSchema[]> {
    return this.orderModel.find().exec();
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemModel.find().exec();
  }
}
