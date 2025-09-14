import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { mailQueueName } from './mail.constants';
import { MailQueueService } from './mail-queue.service';
import { EmailsQueueProcessor } from './send-email.processor';
import { NodemailerProvider } from './nodemailer.provider';
import { MAIL_PROVIDER_TOKEN } from './mail-tokens';

@Module({
  imports: [
    BullModule.registerQueue({
      name: mailQueueName,
    }),
  ],
  providers: [
    MailQueueService,
    EmailsQueueProcessor,
    { provide: MAIL_PROVIDER_TOKEN, useClass: NodemailerProvider },
  ],
  exports: [MailQueueService],
})
export class MailModule {}
