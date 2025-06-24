import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderMongoEntity } from './mongo/documents/order.document';
import { OrderRepositoryContract } from '../domain/persistence/order.repository';
import { OrderModelContract } from '../domain/order';
import { OrderMongoMapper } from './mongo/order-mongo.mapper';
import { RepositoryException } from '../shared/exceptions/repository.exception';

type FindByOptions = {
  orderBy?: { field: keyof OrderModelContract; direction: 'asc' | 'desc' };
};

@Injectable()
export class OrderMongoRepository implements OrderRepositoryContract {
  constructor(
    @InjectModel(OrderMongoEntity.name)
    private readonly orderModel: Model<OrderMongoEntity>,
  ) {}

  async createOne(entity: OrderModelContract): Promise<OrderModelContract> {
    try {
      const mongoObj = OrderMongoMapper.toPersistence(entity);
      const created = await this.orderModel.create(mongoObj);
      return OrderMongoMapper.toDomain(created.toObject());
    } catch (error) {
      throw new RepositoryException('Fail to create order', error);
    }
  }

  async findAll(): Promise<OrderModelContract[]> {
    try {
      const docs = await this.orderModel.find().exec();
      return docs.map((doc) => OrderMongoMapper.toDomain(doc.toObject()));
    } catch (error) {
      throw new RepositoryException('Fail to find all orders', error);
    }
  }

  async findById(id: string): Promise<OrderModelContract | null> {
    try {
      const doc = await this.orderModel.findById(id);
      return doc ? OrderMongoMapper.toDomain(doc.toObject()) : null;
    } catch (error) {
      throw new RepositoryException(`Fail to find order by id: ${id}`, error);
    }
  }

  async update(entity: OrderModelContract): Promise<void> {
    try {
      await this.orderModel.updateOne(
        { _id: entity.id },
        OrderMongoMapper.toPersistence(entity),
      );
    } catch (error) {
      throw new RepositoryException(
        `Fail to update order with id: ${entity.id}`,
        error,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.orderModel.findByIdAndDelete(id);
    } catch (error) {
      throw new RepositoryException(
        `Fail to delete order with id: ${id}`,
        error,
      );
    }
  }

  async findOneBy(
    query: Partial<OrderModelContract>,
  ): Promise<OrderModelContract | null> {
    try {
      const doc = await this.orderModel.findOne(query);
      return doc ? OrderMongoMapper.toDomain(doc.toObject()) : null;
    } catch (error) {
      throw new RepositoryException(
        `Fail to find order by query: ${JSON.stringify(query)}`,
        error,
      );
    }
  }

  async findBy(
    query: Partial<OrderModelContract>,
    options?: FindByOptions,
  ): Promise<OrderModelContract[]> {
    try {
      const queryBuilder = this.orderModel.find(query);

      if (options?.orderBy) {
        const sort: Record<string, 1 | -1> = {
          [options.orderBy.field]: options.orderBy.direction === 'asc' ? 1 : -1,
        };
        queryBuilder.sort(sort);
      }

      const docs = await queryBuilder.exec();
      return docs.map((doc) => OrderMongoMapper.toDomain(doc.toObject()));
    } catch (error) {
      throw new RepositoryException(
        `Fail to find orders by query: ${JSON.stringify(query, null, 2)}`,
        error,
      );
    }
  }
}
