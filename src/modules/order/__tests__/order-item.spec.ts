import { OrderItem } from '../order-item';
import { Money } from '../../../shared/domain/value-objects/money.vo';
import {
  Currency,
  CurrencyEnum,
} from '../../../shared/domain/value-objects/currency.vo';

describe('OrderItem', () => {
  const currency = new Currency(CurrencyEnum.BRL);

  it('deve calcular o total sem desconto', () => {
    const item = new OrderItem({
      id: '1',
      productId: 'p1',
      quantity: 2,
      price: new Money(50, currency),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const total = item.getTotalPrice();
    expect(total.amount).toBe(100);
    expect(total.currency.code).toBe('BRL');
  });

  it('deve calcular o desconto fixo corretamente', () => {
    const item = new OrderItem({
      id: '2',
      productId: 'p2',
      quantity: 1,
      price: new Money(100, currency),
      discount: {
        type: 'fixed',
        value: 30,
        currency,
        couponCode: 'FIX30',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const discount = item.getDiscountAmount();
    expect(discount.amount).toBe(30);
    console.log(JSON.stringify(item, null, 2));
  });

  it('deve calcular o desconto percentual corretamente', () => {
    const item = new OrderItem({
      id: '3',
      productId: 'p3',
      quantity: 2,
      price: new Money(50, currency),
      discount: {
        type: 'percentage',
        value: 10, // 10%
        couponCode: 'PERC10',
        currency: new Currency(CurrencyEnum.BRL),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const discount = item.getDiscountAmount();
    expect(discount.amount).toBe(10); // 10% de 100
  });

  it('deve calcular o total com desconto', () => {
    const item = new OrderItem({
      id: '4',
      productId: 'p4',
      quantity: 3,
      price: new Money(20, currency),
      discount: {
        type: 'fixed',
        value: 15,
        currency,
        couponCode: 'FIX15',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const totalComDesconto = item.getTotalWithDiscount();
    expect(totalComDesconto.amount).toBe(45); // (3 * 20) - 15
  });

  it('deve impedir desconto maior que o total', () => {
    const item = new OrderItem({
      id: '5',
      productId: 'p5',
      quantity: 1,
      price: new Money(50, currency),
      discount: {
        type: 'fixed',
        value: 100,
        currency,
        couponCode: 'OVER',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const totalComDesconto = item.getTotalWithDiscount();
    expect(totalComDesconto.amount).toBe(0);
  });

  // it('deve lançar erro se moeda do desconto for diferente da do item', () => {
  //   const otherCurrency = new Currency(CurrencyEnum.USD);

  //   const item = new OrderItem({
  //     id: '6',
  //     productId: 'p6',
  //     quantity: 1,
  //     price: new Money(100, currency),
  //     discount: {
  //       type: 'fixed',
  //       value: 10,
  //       currency: otherCurrency,
  //       couponCode: 'WRONGCURRENCY',
  //     },
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   });

  //   expect(() => item.getDiscountAmount()).toThrowError(
  //     'Desconto em moeda diferente do pedido',
  //   );
  // });
});
