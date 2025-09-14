import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailProvider } from './mail-provider.interface';

@Injectable()
export class NodemailerProvider implements MailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: '127.0.0.1',
      port: 2525,
      secure: false,
      auth: {},
      ignoreTLS: true,
      requireTLS: false,
    });
  }

  async sendMail(payload: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    await this.transporter.sendMail({
      to: payload.to,
      subject: payload.subject,
      text: payload.body,
    });
  }
}
