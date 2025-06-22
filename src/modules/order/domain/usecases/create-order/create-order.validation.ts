import { ZodValidator } from '@/src/shared/domain/validation/zod-validator';
import { z } from 'zod';
import { CreateOrderGraphQLInput } from '../../../application/graphql/inputs/order.inputs';

export const MoneyInputSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  currency: z.string().min(1, 'Currency is required'),
});

export const DiscountInputSchema = z.object({
  couponCode: z.string().min(1, 'Coupon code is required'),
  value: z.number().nonnegative('Discount value must be >= 0'),
  type: z.enum(['percentage', 'fixed']),
  currency: z.string().min(1, 'Currency is required'),
});

export const OrderItemInputSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  price: MoneyInputSchema,
  discount: DiscountInputSchema.optional(),
  seller: z.string().optional(),
  title: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  shippingId: z.string().optional(),
});

export const BillingAddressInputSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
});

export const InstallmentInputSchema = z.object({
  number: z.number().int().positive(),
  value: z.number().positive(),
  interestRate: z.number().nonnegative().optional(),
  totalValue: z.number().nonnegative().optional(),
  dueDate: z.string().optional(),
});

export const PaymentSnapshotInputSchema = z.object({
  method: z.string().min(1),
  status: z.string().min(1),
  amount: z.number().nonnegative(),
  transactionId: z.string().optional(),
  installments: z.array(InstallmentInputSchema).optional(),
});

export const ShippingSnapshotInputSchema = z.object({
  shippingId: z.string().optional(),
  status: z.string().min(1),
  carrier: z.string().min(1),
  service: z.string().min(1),
  fee: z.number().nonnegative().optional(),
  deliveryDate: z.string().optional(),
  recipient: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  status: z.string().min(1),
  items: z
    .array(OrderItemInputSchema)
    .nonempty('At least one item is required'),
  currency: z.string().min(1),
  paymentSnapshot: PaymentSnapshotInputSchema,
  shippingSnapshot: ShippingSnapshotInputSchema,
  billingAddress: BillingAddressInputSchema,
  customerId: z.string().min(1),
  paymentId: z.string().min(1),
  notes: z.string().optional(),
  discount: DiscountInputSchema.optional(),
});

// Inferido para tipo Typescript se quiser usar
export type CreateOrderSchemaType = z.infer<typeof CreateOrderSchema>;

export class CreateOrderValidation {
  private validator = new ZodValidator(CreateOrderSchema);

  validate(command: CreateOrderGraphQLInput) {
    return this.validator.validate(command);
  }
}
