import { InputType, Field, Float, ID } from '@nestjs/graphql';

// Reutilizável: Money input
@InputType()
class MoneyInput {
  @Field(() => Float)
  amount: number;

  @Field()
  currency: string;
}

// Reutilizável: Discount input
@InputType()
class DiscountInput {
  @Field()
  couponCode: string;

  @Field(() => Float)
  value: number;

  @Field()
  type: 'percentage' | 'fixed';

  @Field()
  currency: string;
}

// Reutilizável: Order Item input
@InputType()
class OrderItemInput {
  @Field()
  productId: string;

  @Field()
  quantity: number;

  @Field(() => MoneyInput)
  price: MoneyInput;

  @Field(() => DiscountInput, { nullable: true })
  discount?: DiscountInput;

  @Field({ nullable: true })
  seller?: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  shippingId?: string;
}

// Billing Address input
@InputType()
class BillingAddressInput {
  @Field()
  street: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zipCode: string;
}

// Payment Snapshot input
@InputType()
class InstallmentInput {
  @Field()
  number: number;

  @Field(() => Float)
  value: number;

  @Field(() => Float, { nullable: true })
  interestRate?: number;

  @Field(() => Float, { nullable: true })
  totalValue?: number;

  @Field({ nullable: true })
  dueDate?: string;
}

@InputType()
class PaymentSnapshotInput {
  @Field()
  method: string;

  @Field()
  status: string;

  @Field(() => Float)
  amount: number;

  @Field({ nullable: true })
  transactionId?: string;

  @Field(() => [InstallmentInput], { nullable: true })
  installments?: InstallmentInput[];
}

// Shipping Snapshot input
@InputType()
class ShippingSnapshotInput {
  @Field({ nullable: true })
  shippingId?: string;

  @Field()
  status: string;

  @Field()
  carrier: string;

  @Field()
  service: string;

  @Field(() => Float, { nullable: true })
  fee?: number;

  @Field({ nullable: true })
  deliveryDate?: string;

  @Field({ nullable: true })
  recipient?: string;
}

// === CREATE ORDER INPUT ===
@InputType()
export class CreateOrderInput {
  @Field()
  status: string;

  @Field(() => [OrderItemInput])
  items: OrderItemInput[];

  @Field()
  currency: string;

  @Field(() => PaymentSnapshotInput)
  paymentSnapshot: PaymentSnapshotInput;

  @Field(() => ShippingSnapshotInput)
  shippingSnapshot: ShippingSnapshotInput;

  @Field(() => BillingAddressInput)
  billingAddress: BillingAddressInput;

  @Field()
  customerId: string;

  @Field()
  paymentId: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => DiscountInput, { nullable: true })
  discount?: DiscountInput;
}

// === UPDATE ORDER INPUT ===
@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  status?: string;

  @Field(() => [OrderItemInput], { nullable: true })
  items?: OrderItemInput[];

  @Field({ nullable: true })
  currency?: string;

  @Field(() => PaymentSnapshotInput, { nullable: true })
  paymentSnapshot?: PaymentSnapshotInput;

  @Field(() => ShippingSnapshotInput, { nullable: true })
  shippingSnapshot?: ShippingSnapshotInput;

  @Field(() => BillingAddressInput, { nullable: true })
  billingAddress?: BillingAddressInput;

  @Field({ nullable: true })
  customerId?: string;

  @Field({ nullable: true })
  paymentId?: string;

  @Field({ nullable: true })
  notes?: string;

  @Field(() => DiscountInput, { nullable: true })
  discount?: DiscountInput;
}
