import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { OrderTypeORMEntity } from './entities/order.entity';
import { OrderModelContract, OrderModelInput } from '../../../domain/order';
import { OrderWritableRepositoryContract } from '../order.respository';
import { OrderStatusEnum } from '@/modules/order/domain/order.constants';

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

  async findById?(id: string): Promise<OrderModelContract | null> {
    const foundedOrder = await this.repo.findOneBy({ id });
    if (!foundedOrder) return null;
    return this.toContract(foundedOrder);
  }

  async update(order: OrderModelInput): Promise<void> {
    const repo = this.getRepository();
    const existing = await repo.findOne({
      where: { id: order.id },
      relations: ['items'], // garantir que vem com items
    });

    if (!existing) {
      throw new Error(`Order with id=${order.id} not found`);
    }

    // Mesclar os campos (evitar sobrescrever createdAt/deletedAt se não vierem no input)
    const updatedEntity = repo.merge(existing, this.toEntity(order));

    await repo.save(updatedEntity);

    this.logger.log(`Order with id=${order.id} updated`);
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

  private toContract(entity: OrderTypeORMEntity): OrderModelContract {
    return {
      id: entity.id,
      status: entity.status as OrderStatusEnum,
      customerId: entity.customerId,
      paymentId: entity.paymentId,
      notes: entity.notes ?? null,
      discount: entity.discount ?? null,
      paymentSnapshot: entity.paymentSnapshot,
      shippingSnapshot: entity.shippingSnapshot,
      billingAddress: entity.billingAddress,
      customerSnapshot: entity.customerSnapshot,
      active: entity.active,
      deleted: entity.deleted,
      deletedAt: entity.deletedAt ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      items: entity.items.map((item) => ({
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
      })),
      currency: entity.items[0]?.price.currency || { code: 'BRL' }, // ⚠️ aqui depende de como você salva currency
    };
  }

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
