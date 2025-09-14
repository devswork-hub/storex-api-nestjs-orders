import { MailProvider } from './mail-provider.interface';

export class FakeMailProvider implements MailProvider {
  async sendMail(payload: any) {
    console.log('Fake send mail:', payload);
  }
}
