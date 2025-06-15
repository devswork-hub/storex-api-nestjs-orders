import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inject, Injectable } from '@nestjs/common';
import { OrderMongoSchema } from './mongo/order.schema';
import { OrderItem } from '../order-item';
import { FindAllOrderService } from '../usecases/find-all-orders.service';
import {
  Currency,
  CurrencyEnum,
} from '@/src/shared/domain/value-objects/currency.vo';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('OrderItem') private readonly orderItemModel: Model<OrderItem>,
    @Inject() private readonly findAllUseCase: FindAllOrderService,
  ) {}

  async finAllOrdersTest(): Promise<OrderMongoSchema[]> {
    console.log('🔍 Buscando pedidos no MongoDB...');
    const data = await this.findAllUseCase.execute();
    data.map((d) => ({ ...d, currency: CurrencyEnum.BRL }));
    return data;
  }

  async findAll(): Promise<OrderItem[]> {
    return await this.orderItemModel.find().exec();
  }
}
