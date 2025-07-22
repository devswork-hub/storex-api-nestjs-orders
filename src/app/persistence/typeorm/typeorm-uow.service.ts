// import { Injectable } from '@nestjs/common';
// import { DataSource, QueryRunner } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';

// @Injectable()
// export class TypeORMUnitOfWork {
//   private queryRunner: QueryRunner;

//   constructor(private readonly dataSource: DataSource) {
//     this.queryRunner = this.dataSource.createQueryRunner();
//   }

//   async startTransaction(): Promise<void> {
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
//     return this.queryRunner.manager;
//   }
// }

@Injectable()
export class TypeORMUnitOfWork {
  private queryRunner: QueryRunner;

  constructor(private readonly dataSource: DataSource) {}

  async startTransaction(): Promise<void> {
    this.queryRunner = this.dataSource.createQueryRunner(); // <-- aqui sim!
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
}
