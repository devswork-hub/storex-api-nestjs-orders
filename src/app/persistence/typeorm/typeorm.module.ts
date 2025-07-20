import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigValues } from '../../config/config.values';
import { TypeOrmConfigService } from './typeorm.config.service';
import { TypeORMUnitOfWork } from './typeorm-uow.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigValues],
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [TypeORMUnitOfWork],
  exports: [TypeORMUnitOfWork],
})
export class TypeORMModule {}
