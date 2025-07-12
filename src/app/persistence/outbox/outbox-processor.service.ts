// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { OutboxRepository } from './outbox-repository';
// import { EventBusService } from './event-bus.service';

// @Injectable()
// export class OutboxProcessorService {
//   constructor(
//     private readonly outboxRepository: OutboxRepository,
//     private readonly eventBusService: EventBusService,
//   ) {}
//   // 每 10 秒輪詢一次 Outbox 表，處理未發送的事件
//   @Cron('*/10 * * * * *') // 這個 CronJob 每 10 秒執行一次
//   async processOutboxEvents() {
//     try {
//       const unprocessedEvents =
//         await this.outboxRepository.findUnprocessedEvents();
//       for (const event of unprocessedEvents) {
//         await this.eventBusService.publishEvent(event.eventName, event.payload);
//         await this.outboxRepository.markEventAsProcessed(event._id);
//       }
//     } catch (error) {
//       console.error('Error processing outbox events:', error);
//     }
//   }
// }
