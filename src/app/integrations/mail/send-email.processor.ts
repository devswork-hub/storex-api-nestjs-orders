import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { mailQueueName } from './mail.constants';
import * as nodemailer from 'nodemailer';

@Processor(mailQueueName)
@Injectable()
export class EmailsQueueProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailsQueueProcessor.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    super();
    this.transporter = nodemailer.createTransport({
      host: '127.0.0.1',
      port: 2525,
      secure: false,
      auth: {},
      ignoreTLS: true,
      requireTLS: false,
    });
  }

  async process(job: Job): Promise<void> {
    const { payload } = job.data;

    this.logger.log(`Processando job #${job.id} da fila '${mailQueueName}'`);
    this.logger.debug(`Payload recebido: ${JSON.stringify(payload, null, 2)}`);

    try {
      await this.transporter.sendMail({
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
