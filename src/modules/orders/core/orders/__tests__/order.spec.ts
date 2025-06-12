import { Order } from '../order';
import { OrderItem } from '../order-item';

describe('Order', () => {
  let order: Order;

  beforeEach(() => {
    order = new Order();
    order.status = 'DELIVERED';
    order.items = [];
    order.currency = 'BRL';
    order.billingAddress = { street: '', city: '', state: '', zipCode: '' };
    order.customerId = 'customer-123';
    order.paymentId = 'payment-abc';
  });

  const addItem = (price: number, quantity = 1): void => {
    order.items.push({ price, quantity } as OrderItem);
  };

  describe('total calculation', () => {
    test('should calculate total correctly without discount', () => {
      addItem(100);
      expect(order.total).toBe(100);
    });

    test('should apply fixed discount correctly', () => {
      addItem(100);
      order.discount = { couponCode: 'FIX10', value: 10, type: 'fixed' };
      expect(order.total).toBe(90);
    });

    test('should apply percentage discount correctly', () => {
      addItem(200);
      order.discount = { couponCode: 'PERC20', value: 20, type: 'percentage' };
      expect(order.total).toBe(160);
    });

    test('should handle zero subTotal with fixed discount gracefully', () => {
      order.discount = { couponCode: 'FIX5', value: 5, type: 'fixed' };
      expect(order.total).toBe(0);
    });

    test('should handle zero subTotal with percentage discount gracefully', () => {
      order.discount = { couponCode: 'PERC10', value: 10, type: 'percentage' };
      expect(order.total).toBe(0);
    });

    test('should return 0 if discount makes total negative', () => {
      addItem(5);
      order.discount = { couponCode: 'BIGDISCOUNT', value: 10, type: 'fixed' };
      expect(order.total).toBe(0);
    });

    test('should return subTotal if discount is undefined', () => {
      addItem(75);
      order.discount = undefined;
      expect(order.total).toBe(75);
    });

    test('should calculate total with complex values and percentage discount', () => {
      addItem(123.45);
      order.discount = { couponCode: 'SALE15', value: 15, type: 'percentage' };
      expect(order.total).toBeCloseTo(104.93, 2);
    });

    test('should calculate total with complex values and fixed discount', () => {
      addItem(123.45);
      order.discount = { couponCode: 'SAVER20', value: 20, type: 'fixed' };
      expect(order.total).toBeCloseTo(103.45, 2);
    });
  });
});
