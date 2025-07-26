import { Injectable, Scope } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class TypeORMUnitOfWork {
  private queryRunner: QueryRunner;

  constructor(private readonly dataSource: DataSource) {}

  async startTransaction<T>(
    work: (manager: QueryRunner['manager']) => Promise<T>,
  ): Promise<T> {
    this.queryRunner = this.dataSource.createQueryRunner();

    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();

    try {
      const result = await work(this.queryRunner.manager);
      await this.queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await this.queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await this.queryRunner.release();
    }
  }
}
