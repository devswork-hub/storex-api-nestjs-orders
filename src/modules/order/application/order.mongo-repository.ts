import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OrderMongoEntity } from './mongo/documents/order.document';
import { OrderModelContract } from '../domain/order';
import { OrderMongoMapper } from './mongo/order-mongo.mapper';
import { RepositoryException } from '../../../shared/domain/exceptions/repository.exception';
import {
  SearchOptions,
  SearchResult,
} from '@/shared/persistence/search/searchable.repository.contract';
import { CriteriaOptions } from '@/shared/persistence/criteria.contract';
import { OrderReadableRepositoryContract } from './persistence/order.respository';

type FindByOptions = {
  orderBy?: { field: keyof OrderModelContract; direction: 'asc' | 'desc' };
};

@Injectable()
export class OrderMongoRepository implements OrderReadableRepositoryContract {
  constructor(
    @InjectModel(OrderMongoEntity.name)
    private readonly orderModel: Model<OrderMongoEntity>,
  ) {}
  searchByCriteria(
    criteria: CriteriaOptions<OrderModelContract>[],
  ): Promise<SearchResult<OrderModelContract>> {
    throw new Error('Method not implemented.');
  }

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
        `Fail to find orders by query: ${JSON.stringify(query)}`,
        error instanceof Error ? error.message : error,
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
  }

  async search(
    options: SearchOptions<Partial<OrderModelContract>>,
  ): Promise<SearchResult<OrderModelContract>> {
    try {
      const filter = options.filter ?? {};
      const sortField = options.sort?.field ?? 'createdAt';
      const sortDir = options.sort?.direction === 'asc' ? 1 : -1;
      const pagination = options.pagination;

      const query = this.orderModel.find(filter).sort({ [sortField]: sortDir });

      console.log(JSON.stringify(filter, null, 2));
      console.log('=============');
      console.log(JSON.stringify(filter, null, 2));

      let skip = 0;
      let limit = 10;

      // 📄 Offset pagination
      if (pagination?.type === 'offset') {
        const page = pagination.page ?? 1;
        limit = pagination.limit ?? 10;
        skip = (page - 1) * limit;

        query.skip(skip).limit(limit);
      }

      // 🔗 Cursor pagination
      if (pagination?.type === 'cursor') {
        limit = pagination.limit ?? 10;
        if (pagination.after) {
          query.find({ _id: { $gt: pagination.after }, ...filter });
        }
        query.limit(limit);
      }

      const [docs, total] = await Promise.all([
        query.exec(),
        this.orderModel.countDocuments(filter),
      ]);

      const items = docs.map((doc) =>
        OrderMongoMapper.toDomain(doc.toObject()),
      );

      // 📄 Retorno offset
      if (pagination?.type === 'offset') {
        const currentPage = pagination.page ?? 1;
        return {
          type: 'offset',
          items,
          total,
          currentPage,
          perPage: limit,
          lastPage: Math.ceil(total / limit),
        };
      }

      // 🔗 Retorno cursor
      if (pagination?.type === 'cursor') {
        const hasNextPage = items.length === limit;
        const nextCursor = hasNextPage
          ? String(docs[docs.length - 1]?._id)
          : null;
        return {
          type: 'cursor',
          items,
          total,
          hasNextPage,
          nextCursor,
        };
      }

      // 🔙 Fallback (sem paginação)
      return {
        type: 'offset',
        items,
        total,
        currentPage: 1,
        perPage: items.length,
        lastPage: 1,
      };
    } catch (error) {
      throw new RepositoryException(
        `Fail to search orders with options: ${JSON.stringify(options)}`,
        error,
      );
    }
  }
}
