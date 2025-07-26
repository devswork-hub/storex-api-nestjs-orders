import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigValues } from '../../config/config.values';
import { TypeOrmConfigService } from './typeorm.config.service';
import { TypeORMUnitOfWork } from './typeorm-uow.service';
// import { TypeORMTransactionInterceptor } from './typeorm-transaction.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigValues],
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [
    TypeORMUnitOfWork,
    // TypeORMTransactionInterceptor
  ],
  exports: [
    TypeORMUnitOfWork,
    // TypeORMTransactionInterceptor
  ],
})
export class TypeORMModule {}
