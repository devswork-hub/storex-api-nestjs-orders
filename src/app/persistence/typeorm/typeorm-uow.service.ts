// import { Injectable, Scope } from '@nestjs/common';
// import { AggregateRoot } from '@nestjs/cqrs';
// import { DataSource, QueryRunner } from 'typeorm';

// /**
//  * Dessa forma, o Unit of Work pode ser injetado em serviços/repositórios.
//  * Não preciso definir o provedor no módulo, pois o NestJS já entende que é um serviço.
//  * { provider: TypeORMUnitOfWork, scope: Scope.REQUEST } é opcional, pois o NestJS já entende que é um serviço com escopo de requisição.
//  */
// @Injectable({ scope: Scope.REQUEST })
// export class TypeORMUnitOfWork {
//   private queryRunner: QueryRunner;
//   private aggregates: Set<AggregateRoot> = new Set<AggregateRoot>();

//   constructor(private readonly dataSource: DataSource) {}

//   async startTransaction(): Promise<void> {
//     this.queryRunner = this.dataSource.createQueryRunner();
//     await this.queryRunner.connect();
//     await this.queryRunner.startTransaction();
//   }

//   async commitTransaction(): Promise<void> {
//     await this.queryRunner.commitTransaction();
//   }

//   async rollbackTransaction(): Promise<void> {
//     await this.queryRunner.rollbackTransaction();
//   }

//   async release(): Promise<void> {
//     await this.queryRunner.release();
//   }

//   getManager() {
//     if (!this.queryRunner) {
//       throw new Error(
//         'QueryRunner não inicializado. Chame startTransaction() primeiro.',
//       );
//     }
//     return this.queryRunner.manager;
//   }

//   addAggregate(aggregate: AggregateRoot): void {
//     this.aggregates.add(aggregate);
//   }

//   getAggregates(): AggregateRoot[] {
//     return Array.from(this.aggregates);
//   }
// }

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
