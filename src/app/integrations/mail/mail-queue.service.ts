import { Injectable } from '@nestjs/common';
import { mailQueueName } from './mail.constants';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SendEmailEvent } from '@/src/modules/order/application/messaging/events/send-email.event';

@Injectable()
export class MailQueueService {
  constructor(@InjectQueue(mailQueueName) private emailsQueue: Queue) {}

  async dispatchTasks(event: Partial<SendEmailEvent>) {
    await this.emailsQueue.add('send-email', event, {
      attempts: 3, // Retry automático até 5x
      backoff: { type: 'exponential', delay: 3000 }, // tempo entre tentativas
      removeOnComplete: true, // remove após completar
      removeOnFail: false, // mantém no Redis se falhar
      delay: 5000, // espera 5s antes de processar
    });
  }
}
