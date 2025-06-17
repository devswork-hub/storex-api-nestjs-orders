// mocks.ts
import {
  Currency,
  CurrencyEnum,
} from '@/src/shared/domain/value-objects/currency.vo';
import { Money } from '@/src/shared/domain/value-objects/money.vo';
import { OrderItemContract } from '../../order-item';
import { OrderModelContract } from '../../order';
import { OrderMapper } from '../order.mapper';
export const mockOrderItem: OrderItemContract = {
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
  subTotal: new Money(200, new Currency(CurrencyEnum.BRL)),
  total: new Money(190, new Currency(CurrencyEnum.BRL)),
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
    method: 'credit_card',
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
};

describe('OrderMapper', () => {
  it('should map OrderModelContract to OrderOutput', () => {
    const output = OrderMapper.toOutput(mockOrder);

    expect(output).toMatchObject({
      id: 'order-1',
      status: 'PENDING',
      customerId: 'cust-001',
      paymentId: 'pay-001',
      notes: 'Pedido urgente',
      currency: 'BRL',
      subTotal: 200,
      total: 190,
      active: true,
      deleted: false,
      discount: {
        value: 10,
        type: 'PERCENTAGE',
        couponCode: 'DESCONTO10',
      },
      paymentSnapshot: {
        method: 'credit_card',
        status: 'paid',
        amount: 190,
        transactionId: 'txn-001',
      },
      shippingSnapshot: expect.objectContaining({
        method: 'PAC',
      }),
      billingAddress: expect.objectContaining({
        street: 'Rua A',
      }),
      items: [
        {
          id: 'item-1',
          productId: 'prod-123',
          quantity: 2,
          price: {
            amount: 100,
            currency: 'BRL',
          },
          discount: {
            value: 10,
            type: 'PERCENTAGE',
            couponCode: 'DESCONTO10',
          },
          seller: 'vendedor-abc',
          title: 'Produto Teste',
          imageUrl: 'https://img.com/produto.jpg',
        },
      ],
    });
  });
});
