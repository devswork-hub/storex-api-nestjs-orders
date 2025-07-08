import { OrderEventsConsumer } from '@/src/modules/order/application/cqrs/events/order-events.consumer';
import { Module } from '@nestjs/common';

@Module({
  providers: [OrderEventsConsumer],
})
export class MessagingModule {}
