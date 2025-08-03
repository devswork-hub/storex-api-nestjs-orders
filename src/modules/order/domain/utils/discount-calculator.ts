import { Currency } from '@/shared/domain/value-objects/currency.vo';

export function calculateDiscountAmount(
  baseAmount: number,
  discount?: {
    type: 'fixed' | 'percentage';
    value: number;
    currency?: Currency;
  },
  baseCurrency?: Currency,
): number {
  if (!discount) return 0;

  if (discount.type === 'fixed') {
    if (
      discount.currency &&
      baseCurrency &&
      discount.currency.code !== baseCurrency.code
    ) {
      throw new Error('Desconto em moeda diferente do base');
    }
    return discount.value;
  }

  if (discount.type === 'percentage') {
    return baseAmount * (discount.value / 100);
  }

  return 0;
}
