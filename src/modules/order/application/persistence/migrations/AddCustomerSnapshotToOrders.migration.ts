import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerSnapshotToOrders1694371200000
  implements MigrationInterface
{
  name = 'AddCustomerSnapshotToOrders1694371200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  ALTER TABLE "orders"
  ADD COLUMN IF NOT EXISTS "customer_snapshot" jsonb DEFAULT '{}'
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "orders"
      DROP COLUMN "customer_snapshot"
    `);
  }
}
