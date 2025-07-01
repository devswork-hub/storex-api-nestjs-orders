import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderMongoEntity } from './mongo/documents/order.document';
import { OrderRepositoryContract } from '../domain/persistence/order.repository';
import { OrderModelContract } from '../domain/order';
import { OrderMongoMapper } from './mongo/order-mongo.mapper';
import { RepositoryException } from '../../../shared/domain/exceptions/repository.exception';
import { SearchResult } from '@/src/shared/persistence/search-result';
import { SearchParams } from '@/src/shared/persistence/search-params';

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

  async findPaginated(page: 1, limit: 10) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.orderModel.find().skip(skip).limit(limit).exec(),
      this.orderModel.countDocuments(),
    ]);

    return {
      items,
      total,
      page,
      limit,
    };
    throw new RepositoryException(
      'Method findPaginated is not implemented in OrderMongoRepository',
    );
  }

  async search(
    params: SearchParams<Partial<OrderModelContract>>,
  ): Promise<SearchResult<OrderModelContract>> {
    try {
      const filter = params.filter ?? {};
      const sortField = params.sortField ?? 'createdAt'; // default
      const sortDir = params.sortDir === 'asc' ? 1 : -1;

      const skip = (params.page - 1) * params.perPage;
      const limit = params.perPage;

      const queryBuilder = this.orderModel
        .find(filter)
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limit);

      const [docs, total] = await Promise.all([
        queryBuilder.exec(),
        this.orderModel.countDocuments(filter),
      ]);

      const items = docs.map((doc) =>
        OrderMongoMapper.toDomain(doc.toObject()),
      );

      return new SearchResult({
        items,
        total,
        currentPage: params.page,
        perPage: params.perPage,
        lastPage: Math.ceil(total / params.perPage),
      });
    } catch (error) {
      throw new RepositoryException(
        `Fail to search orders with params: ${JSON.stringify(params)}`,
        error,
      );
    }
  }
}
