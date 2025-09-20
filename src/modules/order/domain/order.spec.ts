import { OrderTestBuilder } from './order-test-builder';
/**
 * Test specs
 * - deve criar e retornar um produto com as atributos essenciais
 * - deve criar e retornar um produto com disconto
 * - deve criar e retornar um produto com 1 item
 * - deve criar e retornar um produto com mais de 1 item (3 para exemplificar)
 * - deve criar e retornar um produto com varios items e validar se cada item esta associado corretamente ao pedido
 */
describe('Order', () => {
  it('should return a valid order aggregate', () => {
    console.log(new OrderTestBuilder());
    console.log(OrderTestBuilder.withDiscount());
  });
});
