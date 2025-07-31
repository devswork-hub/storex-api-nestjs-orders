import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { mailQueueName } from './mail.constants';

@Processor(mailQueueName)
@Injectable()
export class EmailsQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailsQueueProcessor.name);

  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { payload } = job.data;

    this.logger.log(`Processando job #${job.id} da fila '${mailQueueName}'`);
    this.logger.debug(`Payload recebido: ${JSON.stringify(payload, null, 2)}`);

    try {
      await this.mailerService.sendMail({
        to: payload.to,
        subject: payload.subject,
        text: payload.body,
      });

      this.logger.log(`E-mail enviado com sucesso para ${payload.to}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar e-mail para ${payload.to}`,
        error.stack,
      );
      throw error; // permite que o BullMQ trate tentativas automáticas
    }
  }
}
