export type MoneyType = 'BRL' | 'EUR' | 'USD';

export class Currency {
  private exchangeRates: Record<MoneyType, number>;

  constructor(exchangeRates: Record<MoneyType, number>) {
    this.exchangeRates = exchangeRates;
  }

  convert(amount: number, from: MoneyType, to: MoneyType): number {
    if (from === to) return amount;
    const rate = this.exchangeRates[to] / this.exchangeRates[from];
    return amount * rate;
  }
}
