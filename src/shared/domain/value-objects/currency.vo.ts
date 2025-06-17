export type CurrencyType = {
  code: string;
};

export class Currency {
  constructor(public readonly code: CurrencyEnum) {}

  getLocale(): string {
    const locales: Record<CurrencyEnum, string> = {
      BRL: 'pt-BR',
      USD: 'en-US',
      EUR: 'de-DE',
    };
    return locales[this.code] ?? 'pt-BR';
  }

  format(amount: number): string {
    return new Intl.NumberFormat(this.getLocale(), {
      style: 'currency',
      currency: this.code,
    }).format(amount);
  }
}

export enum CurrencyEnum {
  BRL = 'BRL',
  EUR = 'EUR',
  USD = 'USD',
}
