import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOrderIdempotencyTable implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_idempotency',
        columns: [
          {
            name: 'client_id',
            type: 'varchar',
            length: '64',
            isPrimary: true,
          },
          {
            name: 'idempotency_key',
            type: 'varchar',
            length: '64',
            isPrimary: true,
          },
          {
            name: 'order_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order_idempotency');
  }
}
