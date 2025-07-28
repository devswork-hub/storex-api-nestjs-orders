import { INestApplication } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

export function configureMicroservices(app: INestApplication) {
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: process.env.RABBITMQ_URL,
      queue: process.env.RABBITMQ_QUEUE_ORDER,
      queueOptions: { durable: false },
    },
  });

  if (process.env.RABBITMQ_QUEUE_PAYMENT) {
    // Verifique se a variável de ambiente existe
    app.connectMicroservice({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.RABBITMQ_QUEUE_PAYMENT, // Fila para mensagens de pagamentos
        queueOptions: { durable: false },
      },
    });
  }
}
