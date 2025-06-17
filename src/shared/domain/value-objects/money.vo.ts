import { Currency } from './currency.vo';
import { ExchangeRateProvider } from './exchange-rate.provider';

export type MoneyPrice = {
  amount: number;
  currency: Currency;
};

export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: Currency,
  ) {}

  add(value: Money): Money {
    if (value.currency.code !== this.currency.code)
      throw new Error('Currency mismatch');
    return new Money(this.amount + value.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  convertTo(to: Currency, provider: ExchangeRateProvider): Money {
    const rate = provider.getRate(this.currency.code, to.code);
    return new Money(this.amount * rate, to);
  }

  toString() {
    return this.currency.format(this.amount);
  }
}

// const m = new Money(4000, new Currency(CurrencyEnum.BRL));
