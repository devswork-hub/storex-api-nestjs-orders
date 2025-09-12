import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { OrderTypeORMEntity } from './entities/order.entity';
import { OrderModelContract, OrderModelInput } from '../../../domain/order';
import { OrderWritableRepositoryContract } from '../order.respository';

@Injectable()
export class OrderTypeORMRepository implements OrderWritableRepositoryContract {
  private readonly logger = new Logger(OrderTypeORMRepository.name);
  private repo: Repository<OrderTypeORMEntity>;
  private transactionManager?: EntityManager;

  constructor(dataSource: DataSource) {
    this.repo = dataSource.getRepository(OrderTypeORMEntity);
    this.logger.log('OrderTypeORMRepository initialized with default repo');
  }

  private getRepository(): Repository<OrderTypeORMEntity> {
    this.logger.log('[OrderTypeORMRepository] Setting transaction manager');
    if (this.transactionManager) {
      this.logger.log('Using transactionManager repository');
      return this.transactionManager.getRepository(OrderTypeORMEntity);
    }
    this.logger.log('Using default repository');
    return this.repo;
  }

  async createOne(order: OrderModelContract): Promise<any> {
    this.logger.log(`Saving order with id=${order.id}`);
    const orderEntity = this.toEntity(order);
    await this.getRepository().save(orderEntity);
    this.logger.log(`Order with id=${order.id} saved`);
    return null;
  }

  private toEntity(order: OrderModelContract): OrderTypeORMEntity {
    return {
      id: order.id,
      status: order.status,
      customerId: order.customerId,
      paymentId: order.paymentId,
      notes: order.notes,
      discount: order.discount,
      paymentSnapshot: order.paymentSnapshot,
      shippingSnapshot: order.shippingSnapshot,
      billingAddress: order.billingAddress,
      customerSnapshot: order.customerSnapshot,
      active: order.active,
      deleted: order.deleted,
      deletedAt: order.deletedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        seller: item.seller,
        title: item.title,
        imageUrl: item.imageUrl,
        description: item.description,
        shippingId: item.shippingId,
        orderId: order.id,
        order: undefined,
      })),
    };
  }

  update: (order: OrderModelInput) => Promise<void>;

  setTransactionManager(manager: EntityManager) {
    this.logger.log('Setting transaction manager');
    this.transactionManager = manager;
  }

  createMany?(entity: OrderModelContract[]): Promise<OrderModelContract[]> {
    throw new Error('Method not implemented.');
  }

  delete?(entityId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
