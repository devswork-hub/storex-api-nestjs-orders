import { BaseModel, BaseModelProps } from '@/shared//domain/base/model.base';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import { Discount } from './order.constants';
import { calculateDiscountAmount } from './utils/discount-calculator';

export type OrderItemModelContract = {
  productId: string;
  quantity: number;
  price: Money;
  discount?: Discount;
  seller?: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  shippingId?: string;
} & BaseModelProps;

export class OrderItemModel
  extends BaseModel
  implements OrderItemModelContract
{
  productId: string;
  quantity: number;
  price: Money;
  discount?: Discount;
  seller?: string;
  title?: string;
  imageUrl?: string;
  description?: string;
  shippingId?: string;

  constructor(props: OrderItemModelContract) {
    super(props);
    Object.assign(this, props);
  }

  getTotalPrice(): Money {
    return this.price.multiply(this.quantity);
  }

  getDiscountAmount(): Money {
    const discountValue = calculateDiscountAmount(
      this.price.amount * this.quantity,
      this.discount,
      this.price.currency,
    );
    return new Money(discountValue, this.price.currency);
  }

  getTotalWithDiscount(): Money {
    const total = this.getTotalPrice();
    const discount = this.getDiscountAmount();
    return new Money(
      Math.max(0, total.amount - discount.amount),
      this.price.currency,
    );
  }

  toContract(): OrderItemModelContract {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      productId: this.productId,
      quantity: this.quantity,
      price: this.price,
      discount: this.discount,
      seller: this.seller,
      title: this.title,
      imageUrl: this.imageUrl,
      description: this.description,
      shippingId: this.shippingId,
      active: this.active,
      deleted: this.deleted,
      deletedAt: this.deletedAt,
    };
  }
}
