import { Module } from '@nestjs/common';
import { OrdersModule } from './order/application/orders.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [OrdersModule],
})
export class DomainsModule {}
