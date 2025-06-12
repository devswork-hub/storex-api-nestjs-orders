import { Order } from '../order';

describe('Order', () => {
  let order: Order;

  // Antes de cada teste, criamos uma nova instância de Order para garantir isolamento
  beforeEach(() => {
    order = new Order();
    order.status = 'DELIVERED'; // Exemplo de status
    order.items = []; // Inicia com items vazios
    order.subTotal = 0; // Inicia com subTotal zero
    order.currency = 'BRL'; // Exemplo de moeda
    order.billingAddress = { street: '', city: '', state: '', zipCode: '' };
    order.customerId = 'customer-123';
    order.paymentId = 'payment-abc';
  });

  describe('total calculation', () => {
    test('should calculate total correctly without discount', () => {
      order.subTotal = 100;
      expect(order.total).toBe(100);
    });

    test('should apply fixed discount correctly', () => {
      order.subTotal = 100;
      order.discount = { couponCode: 'FIX10', value: 10, type: 'fixed' };
      expect(order.total).toBe(90);
    });

    test('should apply percentage discount correctly', () => {
      order.subTotal = 200;
      order.discount = { couponCode: 'PERC20', value: 20, type: 'percentage' }; // 20% de desconto
      expect(order.total).toBe(160); // 200 - (200 * 0.20) = 160
    });

    test('should handle zero subTotal with fixed discount gracefully', () => {
      order.subTotal = 0;
      order.discount = { couponCode: 'FIX5', value: 5, type: 'fixed' };
      expect(order.total).toBe(0); // Total não deve ser negativo
    });

    test('should handle zero subTotal with percentage discount gracefully', () => {
      order.subTotal = 0;
      order.discount = { couponCode: 'PERC10', value: 10, type: 'percentage' };
      expect(order.total).toBe(0);
    });

    test('should return 0 if discount makes total negative', () => {
      order.subTotal = 5;
      order.discount = { couponCode: 'BIGDISCOUNT', value: 10, type: 'fixed' };
      expect(order.total).toBe(0);
    });

    test('should return subTotal if discount is undefined', () => {
      order.subTotal = 75;
      order.discount = undefined; // Garante que não há desconto
      expect(order.total).toBe(75);
    });

    test('should calculate total with complex values and percentage discount', () => {
      order.subTotal = 123.45;
      order.discount = { couponCode: 'SALE15', value: 15, type: 'percentage' }; // 15% de desconto
      // 123.45 - (123.45 * 0.15) = 123.45 - 18.5175 = 104.9325
      expect(order.total).toBeCloseTo(104.93); // Usar toBeCloseTo para números flutuantes
    });

    test('should calculate total with complex values and fixed discount', () => {
      order.subTotal = 123.45;
      order.discount = { couponCode: 'SAVER20', value: 20, type: 'fixed' };
      // 123.45 - 20 = 103.45
      expect(order.total).toBe(103.45);
    });
  });
});
