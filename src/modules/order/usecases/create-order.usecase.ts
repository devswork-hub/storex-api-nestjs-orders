// create-order.dto.ts
import { Injectable } from '@nestjs/common';
import {
  BillingAddress,
  Discount,
  PaymentSnapshot,
  ShippingSnapshot,
} from '../order.constants';
import { OrderItemContract } from '../order-item';
import { Currency } from '@/src/shared/domain/value-objects/currency.vo';
import { BaseUseCaseContract } from '@/src/shared/domain/base/usecase.base';
import { OrderModel, OrderModelContract } from '../order';
import { OrderRepositoryContract } from '../persistence/order.repository';

export type CreateOrderDTO = {
  items: OrderItemContract[];
  // currency: Currency;
  // paymentSnapshot: PaymentSnapshot;
  // shippingSnapshot: ShippingSnapshot;
  // billingAddress: BillingAddress;
  customerId: string;
  paymentId: string;
  notes?: string;
  // discount?: Discount;
};

@Injectable()
export class CreateOrderService
  implements BaseUseCaseContract<CreateOrderDTO, OrderModelContract>
{
  constructor(private readonly repository: OrderRepositoryContract) {}

  async execute(dto: CreateOrderDTO): Promise<OrderModel> {
    // // Convert OrderItemContract[] to OrderItem[]
    // const items = dto.items.map((item) =>
    //   // Replace this with the correct factory or constructor for OrderItem
    //   // For example, if you have OrderItem.create or new OrderItem:
    //   OrderItem.create ? OrderItem.create(item) : new OrderItem(item),
    // );

    const order = OrderModel.create({
      ...dto,
      items: [],
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false,
      subTotal: 0,
      total: 0,
      currency: undefined,
      paymentSnapshot: {
        method: 'credit_card',
        status: '',
        amount: 0,
        transactionId: '',
        installments: [],
      },
      shippingSnapshot: {
        shippingId: '',
        status: 'SHIPPED',
        carrier: '',
        service: '',
        fee: 0,
        deliveryDate: '',
        recipient: '',
      },
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
      },
    });

    const persisted = await this.repository.createOne(order);
    return persisted as OrderModel;
  }
}
