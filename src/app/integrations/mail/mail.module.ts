import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { mailQueueName } from './mail.constants';
import { MailQueueService } from './mail-queue.service';
import { EmailsQueueProcessor } from './send-email.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: mailQueueName,
    }),
  ],
  providers: [MailQueueService, EmailsQueueProcessor],
  exports: [MailQueueService],
})
export class MailModule {}
