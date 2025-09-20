import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNullableToOutboxPayloadAttribute1726770000000
  implements MigrationInterface
{
  name = 'AddNullableToOutboxPayloadAttribute1726770000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "outbox"
      ALTER COLUMN "payload" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "outbox"
      ALTER COLUMN "payload" SET NOT NULL
    `);
  }
}
