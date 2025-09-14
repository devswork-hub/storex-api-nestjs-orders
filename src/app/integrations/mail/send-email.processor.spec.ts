import { EmailsQueueProcessor } from './send-email.processor';
import { MailProvider } from './mail-provider.interface';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';

describe('EmailsQueueProcessor', () => {
  let processor: EmailsQueueProcessor;
  let mailProvider: MailProvider;

  beforeAll(() => {
    Logger.overrideLogger(false);
  });

  beforeEach(() => {
    // cria um mock do MailProvider (falso, só pra teste)
    mailProvider = {
      // "sendMail" vai se comportar como uma função fake que sempre resolve sem erro
      sendMail: jest.fn().mockResolvedValue(undefined),
    };

    // instancia o EmailsQueueProcessor injetando o mailProvider fake
    processor = new EmailsQueueProcessor(mailProvider);
  });

  it('deve processar e enviar um e-mail com sucesso', async () => {
    // cria um job fake (simula o BullMQ)
    const job = {
      id: 1, // id do job
      data: {
        payload: {
          to: 'test@example.com', // destinatário
          subject: 'Olá', // assunto
          body: 'Mensagem de teste', // corpo do email
        },
      },
    } as unknown as Job; // força a tipagem como Job

    // chama o process do EmailsQueueProcessor
    await processor.process(job);

    // garante que o mailProvider.sendMail foi chamado com os dados corretos
    expect(mailProvider.sendMail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Olá',
      body: 'Mensagem de teste',
    });
  });

  it('deve lançar erro se o envio falhar', async () => {
    // força o mock a rejeitar uma promise (simula erro no envio)
    (mailProvider.sendMail as jest.Mock).mockRejectedValueOnce(
      new Error('Falha no envio'),
    );

    // cria outro job fake, agora simulando falha
    const job = {
      id: 2,
      data: {
        payload: {
          to: 'fail@example.com',
          subject: 'Erro',
          body: 'Teste falho',
        },
      },
    } as unknown as Job;

    // espera que o process lance erro (rejeite a promise)
    await expect(processor.process(job)).rejects.toThrow('Falha no envio');
  });
});
