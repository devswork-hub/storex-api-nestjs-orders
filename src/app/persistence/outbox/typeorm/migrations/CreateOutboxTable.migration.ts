import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateOutboxTable1710000000000 implements MigrationInterface {
  // Nome da tabela a ser criada
  private readonly tableName = 'outbox';
  // Nome do índice que otimiza a busca por eventos não processados
  private readonly processedIndexName = 'IDX_OUTBOX_PROCESSED';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Criação da Tabela 'outbox'
    await queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
          },
          {
            name: 'aggregate_type', // snake_case por causa da SnakeNamingStrategy
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'aggregate_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'event_type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'payload',
            type: 'jsonb', // Tipo 'jsonb' para melhor performance com PostgreSQL
            isNullable: false,
          },
          {
            name: 'processed',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
            isNullable: false,
          },
        ],
      }),
      true, // Se 'ifNotExist' for true, não lança erro se já existir
    );

    // 2. Criação do Índice para a busca rápida de eventos não processados
    // A query de busca usa WHERE processed = false e ORDER BY createdAt ASC
    await queryRunner.createIndex(
      this.tableName,
      new TableIndex({
        name: this.processedIndexName,
        columnNames: ['processed', 'created_at'],
        // Este índice composto é ideal para a sua query de leitura (findUnprocessed)
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remove o Índice
    await queryRunner.dropIndex(this.tableName, this.processedIndexName);

    // 2. Remove a Tabela
    await queryRunner.dropTable(this.tableName);
  }
}
