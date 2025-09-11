import { custom, z } from 'zod';
import { CreateOrderSchema } from './create-order.validation';

describe('CreateOrderSchema', () => {
  const validOrder = {
    status: 'pending',
    currency: 'BRL',
    customerId: 'customer-1',
    paymentId: 'payment-1',
    paymentSnapshot: {
      method: 'credit_card',
      status: 'paid',
      amount: 150,
    },
    shippingSnapshot: {
      status: 'ready',
      carrier: 'Correios',
      service: 'SEDEX',
    },
    customerSnapshot: {
      customerId: 'customer-1',
      name: 'João Silva',
      email: 'email@gmail.com',
    },
    billingAddress: {
      street: 'Rua A',
      city: 'São Luís',
      state: 'MA',
      zipCode: '65000-000',
    },
    items: [
      {
        productId: 'product-1',
        quantity: 2,
        price: {
          amount: 75,
          currency: 'BRL',
        },
      },
    ],
  };

  it('deve validar um pedido válido com sucesso', () => {
    expect(() => CreateOrderSchema.parse(validOrder)).not.toThrow();
  });

  it('deve lançar erro se o status estiver vazio', () => {
    const order = { ...validOrder, status: '' };
    expect(() => CreateOrderSchema.parse(order)).toThrow(z.ZodError);
  });

  it('deve lançar erro se os items estiverem vazios', () => {
    const order = { ...validOrder, items: [] };
    expect(() => CreateOrderSchema.parse(order)).toThrow(z.ZodError);
  });

  it('deve lançar erro se o price.amount for negativo', () => {
    const order = {
      ...validOrder,
      items: [
        {
          ...validOrder.items[0],
          price: {
            amount: -10,
            currency: 'BRL',
          },
        },
      ],
    };
    expect(() => CreateOrderSchema.parse(order)).toThrow(z.ZodError);
  });

  it('deve lançar erro se o payment.amount não for número', () => {
    const order = {
      ...validOrder,
      paymentSnapshot: {
        ...validOrder.paymentSnapshot,
        amount: '150', // inválido: string
      },
    };
    expect(() => CreateOrderSchema.parse(order)).toThrow(z.ZodError);
  });

  it('deve validar corretamente com desconto opcional', () => {
    const order = {
      ...validOrder,
      discount: {
        couponCode: 'OFF10',
        value: 10,
        type: 'percentage',
        currency: 'BRL',
      },
    };

    expect(() => CreateOrderSchema.parse(order)).not.toThrow();
  });

  it('deve lançar erro se o discount.type for inválido', () => {
    const order = {
      ...validOrder,
      discount: {
        couponCode: 'OFF10',
        value: 10,
        type: 'invalid', // inválido
        currency: 'BRL',
      },
    };

    expect(() => CreateOrderSchema.parse(order)).toThrow(z.ZodError);
  });

  it('deve aceitar installments opcionais no payment', () => {
    const order = {
      ...validOrder,
      paymentSnapshot: {
        ...validOrder.paymentSnapshot,
        installments: [
          {
            number: 2,
            value: 75,
            interestRate: 0,
          },
        ],
      },
    };

    expect(() => CreateOrderSchema.parse(order)).not.toThrow();
  });

  it('deve lançar erro se billing zipCode for vazio', () => {
    const order = {
      ...validOrder,
      billingAddress: {
        ...validOrder.billingAddress,
        zipCode: '',
      },
    };

    expect(() => CreateOrderSchema.parse(order)).toThrow(z.ZodError);
  });
});
