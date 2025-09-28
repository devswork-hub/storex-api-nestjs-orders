import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrderAndOrderItemsTables1694371200000
  implements MigrationInterface
{
  name = 'CreateOrderAndOrderItemsTables1694371200000'; // O número será diferente

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Criar a tabela 'orders'
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'status', type: 'varchar', length: '50' },
          { name: 'payment_snapshot', type: 'jsonb' },
          { name: 'shipping_snapshot', type: 'jsonb' },
          { name: 'billing_address', type: 'jsonb' },
          { name: 'customer_snapshot', type: 'jsonb' },
          { name: 'customer_id', type: 'varchar' },
          { name: 'payment_id', type: 'varchar', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          { name: 'discount', type: 'jsonb', isNullable: true },
          { name: 'active', type: 'boolean', default: 'true' },
          { name: 'deleted', type: 'boolean', default: 'false' },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true,
    );

    // 2. Criar a tabela 'order_items'
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          { name: 'id', type: 'varchar', isPrimary: true },
          { name: 'order_id', type: 'varchar' },
          { name: 'product_id', type: 'varchar' },
          { name: 'quantity', type: 'integer' },
          { name: 'price', type: 'jsonb' },
          { name: 'discount', type: 'jsonb', isNullable: true },
          { name: 'seller', type: 'varchar', isNullable: true },
          { name: 'title', type: 'varchar', isNullable: true },
          { name: 'image_url', type: 'varchar', isNullable: true },
          { name: 'description', type: 'varchar', isNullable: true },
          { name: 'shipping_id', type: 'varchar', isNullable: true },
        ],
      }),
      true,
    );

    // 3. Adicionar a Chave Estrangeira
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'orders',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('order_items', 'FK_order_items_orders'); // Nome da FK pode variar, use o gerado ou o padrão
    await queryRunner.dropTable('order_items');
    await queryRunner.dropTable('orders');
  }
}
