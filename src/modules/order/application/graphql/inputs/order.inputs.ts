import { InputType, Field, Float, ID } from '@nestjs/graphql';

// Reutilizável: Money input
@InputType({
  description: 'Representa um valor monetário com moeda e quantia.',
})
class MoneyInput {
  @Field(() => Float, { description: 'Quantia monetária (ex: 99.99).' })
  amount: number;

  @Field({ description: 'Código da moeda (ex: BRL, USD).' })
  currency: string;
}

// Reutilizável: Discount input
@InputType({ description: 'Informações de desconto aplicável à compra.' })
class DiscountInput {
  @Field({ description: 'Código do cupom de desconto.' })
  couponCode: string;

  @Field(() => Float, { description: 'Valor do desconto aplicado.' })
  value: number;

  @Field({ description: 'Tipo do desconto (percentage ou fixed).' })
  type: 'percentage' | 'fixed';

  @Field(() => String, { description: 'Moeda usada no desconto.' })
  currency: string;
}

// Reutilizável: Order Item input
@InputType({ description: 'Item que compõe o pedido.' })
class OrderItemInput {
  @Field({ description: 'ID do produto.' })
  productId: string;

  @Field({ description: 'Quantidade desejada do produto.' })
  quantity: number;

  @Field(() => MoneyInput, { description: 'Preço unitário do produto.' })
  price: MoneyInput;

  @Field(() => DiscountInput, {
    nullable: true,
    description: 'Desconto aplicado ao item, se houver.',
  })
  discount?: DiscountInput;

  @Field({
    nullable: true,
    description: 'Identificador do vendedor, se aplicável.',
  })
  seller?: string;

  @Field({ nullable: true, description: 'Título do produto.' })
  title?: string;

  @Field({ nullable: true, description: 'URL da imagem do produto.' })
  imageUrl?: string;

  @Field({ nullable: true, description: 'Descrição do produto.' })
  description?: string;

  @Field({
    nullable: true,
    description: 'ID do envio (caso item tenha logística individual).',
  })
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
@InputType({
  description: 'Dados necessários para a criação de um novo pedido.',
})
export class CreateOrderGraphQLInput {
  @Field({ description: 'Status inicial do pedido (ex: pending, paid).' })
  status: string;

  @Field(() => [OrderItemInput], {
    description: 'Lista de itens que compõem o pedido.',
  })
  items: OrderItemInput[];

  @Field({ description: 'Moeda utilizada no pedido.' })
  currency: string;

  @Field(() => PaymentSnapshotInput, {
    description: 'Informações do pagamento no momento da compra.',
  })
  paymentSnapshot: PaymentSnapshotInput;

  @Field(() => ShippingSnapshotInput, {
    description: 'Detalhes da logística e envio do pedido.',
  })
  shippingSnapshot: ShippingSnapshotInput;

  @Field(() => BillingAddressInput, {
    description: 'Endereço de cobrança do cliente.',
  })
  billingAddress: BillingAddressInput;

  @Field({ description: 'ID do cliente responsável pela compra.' })
  customerId: string;

  @Field({ description: 'ID do pagamento associado.' })
  paymentId: string;

  @Field({
    nullable: true,
    description: 'Observações adicionais fornecidas pelo cliente ou sistema.',
  })
  notes?: string;

  @Field(() => DiscountInput, {
    nullable: true,
    description: 'Desconto geral aplicado ao pedido.',
  })
  discount?: DiscountInput;
}

// === UPDATE ORDER INPUT ===
@InputType()
export class UpdateOrderGraphQLInput {
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
