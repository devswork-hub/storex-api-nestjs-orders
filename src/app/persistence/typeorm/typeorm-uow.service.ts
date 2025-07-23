import { Injectable } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { DataSource, QueryRunner } from 'typeorm';

@Injectable()
export class TypeORMUnitOfWork {
  private queryRunner: QueryRunner;
  private aggregates: Set<AggregateRoot> = new Set<AggregateRoot>();

  constructor(private readonly dataSource: DataSource) {}

  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  async release(): Promise<void> {
    await this.queryRunner.release();
  }

  getManager() {
    if (!this.queryRunner) {
      throw new Error(
        'QueryRunner não inicializado. Chame startTransaction() primeiro.',
      );
    }
    return this.queryRunner.manager;
  }

  addAggregate(aggregate: AggregateRoot): void {
    this.aggregates.add(aggregate);
  }

  getAggregates(): AggregateRoot[] {
    return Array.from(this.aggregates);
  }
}
