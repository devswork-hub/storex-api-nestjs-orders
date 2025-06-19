// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Inject, Injectable } from '@nestjs/common';
// import { OrderMongoSchema } from './mongo/order.schema.v2';
// import { OrderItem } from '../order-item';
// import { FindAllOrderService } from '../usecases/find-all-orders.service';
// import {
//   Currency,
//   CurrencyEnum,
// } from '@/src/shared/domain/value-objects/currency.vo';

// @Injectable()
// export class OrderService {
//   constructor(
//     @InjectModel('OrderItem') private readonly orderItemModel: Model<OrderItem>,
//     @Inject() private readonly findAllUseCase: FindAllOrderService,
//   ) {}

//   async finAllOrdersTest(): Promise<OrderMongoSchema[]> {
//     const data = await this.findAllUseCase.execute();
//     const result: OrderMongoSchema[] = data.map((order) => {
//       return {
//         status: order.status,
//         items: order.items.map((item) => new OrderItem(item)), // transforma os items
//         subTotal: Number(order.subTotal.toString()),
//         total: Number(order.total.toString()),
//         paymentSnapshot: order.paymentSnapshot,
//         shippingSnapshot: order.shippingSnapshot,
//         billingAddress: order.billingAddress,
//         customerId: order.customerId,
//         paymentId: order.paymentId,
//         notes: order.notes,
//         discount: order.discount,
//       };
//     });

//     return result;
//   }

//   async findAll(): Promise<OrderItem[]> {
//     return await this.orderItemModel.find().exec();
//   }
// }
