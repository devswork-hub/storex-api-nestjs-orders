import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { mailQueueName } from './mail.constants';
import { MailProvider } from './mail-provider.interface';

@Processor(mailQueueName)
@Injectable()
export class EmailsQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailsQueueProcessor.name);

  constructor(
    @Inject('MailProvider') private readonly mailProvider: MailProvider,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    const { payload } = job.data;

    this.logger.log(`Processando job #${job.id} da fila '${mailQueueName}'`);
    this.logger.debug(`Payload recebido: ${JSON.stringify(payload, null, 2)}`);

    try {
      await this.mailProvider.sendMail(payload);
      this.logger.log(`E-mail enviado com sucesso para ${payload.to}`);
    } catch (error) {
      this.logger.error(
        `Erro ao enviar e-mail para ${payload.to}`,
        error.stack,
      );
      throw error;
    }
  }
}
