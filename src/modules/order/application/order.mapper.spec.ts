import { Money } from '@/shared//domain/value-objects/money.vo';
import { OrderModelContract } from '../domain/order';
import { OrderItemModelContract } from '../domain/order-item';
import { PaymentMethodEnum } from '../domain/order.constants';
import {
  Currency,
  CurrencyEnum,
} from '@/shared//domain/value-objects/currency.vo';
export const mockOrderItem: OrderItemModelContract = {
  id: 'item-1',
  productId: 'prod-123',
  quantity: 2,
  price: new Money(100, new Currency(CurrencyEnum.BRL)),
  discount: {
    value: 10,
    type: 'percentage',
    couponCode: 'DESCONTO10',
    currency: new Currency(CurrencyEnum.BRL),
  },
  seller: 'vendedor-abc',
  title: 'Produto Teste',
  imageUrl: 'https://img.com/produto.jpg',
  description: 'Descrição do produto',
  shippingId: 'ship-001',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
};

export const mockOrder: OrderModelContract = {
  id: 'order-1',
  status: 'PENDING',
  customerId: 'cust-001',
  paymentId: 'pay-001',
  notes: 'Pedido urgente',
  currency: new Currency(CurrencyEnum.BRL),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-02'),
  active: true,
  deleted: false,
  deletedAt: undefined,
  items: [mockOrderItem],
  discount: {
    value: 10,
    type: 'percentage',
    couponCode: 'DESCONTO10',
    currency: new Currency(CurrencyEnum.BRL),
  },
  paymentSnapshot: {
    method: PaymentMethodEnum.CREDIT_CARD,
    status: 'paid',
    amount: 190,
    transactionId: 'txn-001',
  },
  shippingSnapshot: {
    status: 'SHIPPED',
    carrier: '',
    service: '',
  },
  billingAddress: {
    street: 'Rua A',
    city: 'São Luís',
    state: 'MA',
    zipCode: '',
  },
  customerSnapshot: { name: 'João Silva', email: '' },
};
