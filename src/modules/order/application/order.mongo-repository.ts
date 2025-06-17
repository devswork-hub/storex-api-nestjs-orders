import { Injectable } from '@nestjs/common';
import { OrderRepositoryContract } from '../persistence/order.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderMongoSchema } from './mongo/order.schema';
import { OrderModelContract } from '../order';
import { OrderItem } from './graphql/schemas/order-item.schema';

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
    // const order = OrderModel.create({
    //   status: 'PENDING',
    //   items: [
    //     {
    //       productId: 'p-001',
    //       quantity: 0,
    //       price: new Money(200, new Currency(CurrencyEnum.BRL)),
    //     },
    //     {
    //       productId: 'p-002',
    //       quantity: 0,
    //       price: new Money(100, new Currency(CurrencyEnum.BRL)),
    //     },
    //   ],
    //   currency: new Currency(CurrencyEnum.BRL),
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

    // const o = {
    //   ...order,
    //   currency: order.currency.code, // ou objeto { code: 'BRL' }
    //   items: order.items.map((item) => ({
    //     ...item,
    //     price: {
    //       amount: item.price.amount,
    //       currency: item.price.currency.code,
    //     },
    //   })),
    //   subTotal: order.subTotal.amount,
    //   total: order.total.amount,
    //   // demais props complexas (paymentSnapshot, shippingSnapshot, etc) se tiverem classes, faça a mesma transformação
    // };
    // console.log(o);
    // await this.orderModel.create(o);

    // await this.orderModel.create({ ...order });

    // console.log(docs[0]);
    // console.log(OrderMongoRepository.name + ' => ', docs);
    // aqui você faria o mapeamento de `OrderMongoSchema` para `OrderModelContract`
    return docs as unknown as OrderModelContract[];
  }

  async create(data: OrderModelContract): Promise<OrderModelContract> {
    const doc = new this.orderModel(data);
    const saved = await doc.save();
    return saved.toObject() as unknown as OrderModelContract;
  }
}
