import { Module } from '@nestjs/common';
import { OrdersModule } from './order/application/orders.module';

@Module({
  imports: [OrdersModule],
})
export class DomainsModule {}
