import { CurrencyEnum } from './currency.vo';

export class ExchangeRateProvider {
  // TODO: criar um service isolado, pra buscar dados monetarios via API
  private readonly rates: Record<CurrencyEnum, Record<CurrencyEnum, number>> = {
    [CurrencyEnum.BRL]: {
      [CurrencyEnum.BRL]: 1,
      [CurrencyEnum.USD]: 0.2,
      [CurrencyEnum.EUR]: 0.18,
    },
    [CurrencyEnum.USD]: {
      [CurrencyEnum.BRL]: 5.0,
      [CurrencyEnum.USD]: 1,
      [CurrencyEnum.EUR]: 0.9,
    },
    [CurrencyEnum.EUR]: {
      [CurrencyEnum.BRL]: 5.5,
      [CurrencyEnum.USD]: 1.1,
      [CurrencyEnum.EUR]: 1,
    },
  };

  /**
   * Retorna a taxa de conversão de `from` para `to`.
   * Se as moedas forem iguais, retorna 1.
   * @throws se não existir taxa definida entre as moedas
   */
  getRate(from: CurrencyEnum, to: CurrencyEnum): number {
    if (from === to) {
      return 1;
    }

    const fromMap = this.rates[from];
    if (!fromMap) {
      throw new Error(`Exchange rates for currency ${from} not found.`);
    }

    const rate = fromMap[to];
    if (rate == null) {
      throw new Error(`Exchange rate not defined from ${from} to ${to}.`);
    }

    return rate;
  }
}
