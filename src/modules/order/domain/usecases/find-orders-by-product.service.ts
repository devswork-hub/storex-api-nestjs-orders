import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class FindOrdersByProductUseCase {
  constructor(private readonly dataSource: DataSource) {}

  async execute(productId: string) {
    const orders = await this.dataSource.query(
      `SELECT o.* FROM orders o
       JOIN order_items oi ON o.id = oi.order_id
       WHERE oi.product_id = $1;`,
      [productId],
    );
    return orders;
  }
}
