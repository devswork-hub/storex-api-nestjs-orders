import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderMongoEntity } from './mongo/order.document';
import { OrderRepositoryContract } from '../domain/persistence/order.repository';
import { OrderModelContract } from '../domain/order';
import { OrderMongoMapper } from './mongo/order-mongo.mapper';

@Injectable()
export class OrderMongoRepository implements OrderRepositoryContract {
  constructor(
    @InjectModel(OrderMongoEntity.name)
    private readonly orderModel: Model<OrderMongoEntity>,
  ) {}

  async createOne(entity: OrderModelContract): Promise<OrderModelContract> {
    const mongoObj = OrderMongoMapper.toPersistence(entity);
    const created = await this.orderModel.create(mongoObj);
    return OrderMongoMapper.toDomain(created.toObject());
  }

  async findAll(): Promise<OrderModelContract[]> {
    const docs = await this.orderModel.find().exec();
    return docs.map((doc) => OrderMongoMapper.toDomain(doc.toObject()));
  }

  async findById(id: string): Promise<OrderModelContract | null> {
    const doc = await this.orderModel.findById(id);
    return doc ? OrderMongoMapper.toDomain(doc.toObject()) : null;
  }

  async update(entity: OrderModelContract): Promise<void> {
    await this.orderModel.updateOne(
      { _id: entity.id },
      OrderMongoMapper.toPersistence(entity),
    );
  }

  async delete(id: string): Promise<void> {
    await this.orderModel.findByIdAndDelete(id);
  }

  async findOneBy(
    query: Partial<OrderModelContract>,
  ): Promise<OrderModelContract | null> {
    const doc = await this.orderModel.findOne(query);
    return doc ? OrderMongoMapper.toDomain(doc.toObject()) : null;
  }

  async findBy(
    query: Partial<OrderModelContract>,
  ): Promise<OrderModelContract[]> {
    const docs = await this.orderModel.find(query);
    return docs.map((d) => OrderMongoMapper.toDomain(d.toObject()));
  }
}
