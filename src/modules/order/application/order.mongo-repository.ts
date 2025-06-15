import { Injectable } from '@nestjs/common';
import { OrderRepositoryContract } from '../persistence/order.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderMongoSchema } from './mongo/order.schema';
import { OrderModelContract } from '../order';
import { OrderItem } from './graphql/order-item.schema';
import { UUID } from '@/src/shared/domain/value-objects/uuid.vo';

@Injectable()
export class OrderMongoRepository implements OrderRepositoryContract {
  constructor(
    @InjectModel('OrderMongoSchema')
    private readonly orderModel: Model<OrderMongoSchema>,
    @InjectModel(OrderItem.name)
    private readonly orderItem: Model<OrderItem>,
  ) {}

  async findAll(): Promise<OrderModelContract[]> {
    const docs = await this.orderModel.find().exec();
    // this.create({
    //   status: 'PENDING',
    //   items: [],
    //   subTotal: 0,
    //   total: 0,
    //   currency: undefined,
    //   paymentSnapshot: {
    //     method: 'credit_card',
    //     status: '',
    //     amount: 0,
    //     transactionId: '',
    //     installments: [],
    //   },
    //   shippingSnapshot: {
    //     shippingId: '',
    //     status: 'SHIPPED',
    //     carrier: '',
    //     service: '',
    //     fee: 0,
    //     deliveryDate: '',
    //     recipient: '',
    //   },
    //   billingAddress: {
    //     street: '',
    //     city: '',
    //     state: '',
    //     zipCode: '',
    //   },
    //   customerId: new UUID().toString(),
    //   paymentId: new UUID().toString(),
    // });
    console.log(OrderMongoRepository.name + ' => ', docs);
    // aqui você faria o mapeamento de `OrderMongoSchema` para `OrderModelContract`
    return docs as unknown as OrderModelContract[];
  }

  async create(data: OrderModelContract): Promise<OrderModelContract> {
    const doc = new this.orderModel(data);
    const saved = await doc.save();
    return saved.toObject() as unknown as OrderModelContract;
  }
}
