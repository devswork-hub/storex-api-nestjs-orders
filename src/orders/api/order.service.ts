import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderItem } from './order-item.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('OrderItem') private readonly orderItemModel: Model<OrderItem>,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemModel.find().exec();
  }
}
