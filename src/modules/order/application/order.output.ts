import { ObjectType } from '@nestjs/graphql';
import { OrderModelContract } from '../order';
import { Currency } from '@/src/shared/domain/value-objects/currency.vo';
import { OrderItem } from '../order-item';
import {
  OrderStatus,
  PaymentSnapshot,
  ShippingSnapshot,
  BillingAddress,
  Discount,
} from '../order.constants';

@ObjectType()
export class OrderOuput implements OrderModelContract {
  status: OrderStatus;
  items: OrderItem[];
  subTotal: number;
  total: number;
  currency: Currency;
  paymentSnapshot: PaymentSnapshot;
  shippingSnapshot: ShippingSnapshot;
  billingAddress: BillingAddress;
  customerId: string;
  paymentId: string;
  notes?: string;
  discount?: Discount;
  id?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
}
