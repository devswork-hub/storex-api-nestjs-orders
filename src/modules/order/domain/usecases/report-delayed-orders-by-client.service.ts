import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

/**
 * Descrição do Caso:
 * Para cada cliente, gere um relatório listando:
 * - Total de pedidos atrasados (status "delayed" e data de entrega menor que hoje)
 * - Soma do valor total desses pedidos
 * - Produto mais comprado (maior quantidade) em cada pedido atrasado
 */
@Injectable()
export class ReportDelayedOrdersByClientUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute() {
    const result = await this.dataSource.query(
      `SELECT 
        o.user_id,
        COUNT(o.id) AS delayed_orders,
        SUM(o.total_price) AS total_delayed_value,
        (
          SELECT oi.product_id
          FROM order_items oi
          WHERE oi.order_id = o.id
          GROUP BY oi.product_id
          ORDER BY SUM(oi.quantity) DESC
          LIMIT 1
        ) AS most_bought_product
      FROM orders o
      WHERE o.status = 'delayed'
        AND o.delivery_date < NOW()
      GROUP BY o.user_id, o.id;`,
    );
    return result;
  }
}
