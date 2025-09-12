import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bullmq';
import { mailQueueName } from './mail.constants';
import { MailQueueService } from './mail-queue.service';
import { EmailsQueueProcessor } from './send-email.processor';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'marta33@ethereal.email',
          pass: 'b1auVW5T48ekDKcKfE',
        },
      },
    }),
    BullModule.registerQueue({
      name: mailQueueName,
    }),
  ],
  providers: [MailQueueService, EmailsQueueProcessor],
  exports: [MailQueueService],
})
export class MailModule {}
