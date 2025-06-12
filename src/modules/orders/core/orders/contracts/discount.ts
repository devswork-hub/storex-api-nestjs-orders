export type Discount = {
  couponCode: string;
  value: number;
  type: 'percentage' | 'fixed';
};
