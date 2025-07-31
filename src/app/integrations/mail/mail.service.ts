import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(notification: {
    email: string;
    message: string;
    subject: string;
  }): Promise<void> {
    const { email, message, subject } = notification;

    await this.mailerService.sendMail({
      to: email,
      subject: 'New Notification',
      text: message,
    });

    console.log(`Mail sent to ${email}`);
  }
}
