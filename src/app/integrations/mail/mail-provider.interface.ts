export interface MailProvider {
  sendMail(payload: {
    to: string;
    subject: string;
    body: string | HTMLAllCollection;
  }): Promise<void>;
}
