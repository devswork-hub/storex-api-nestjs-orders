import { ValidationException } from '@/shared/domain/validation/validation-exception';
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConsumeMessage, MessagePropertyHeaders } from 'amqplib';

@Catch()
export class RabbitMQConsumerErrorFilter implements ExceptionFilter {
  private logger = new Logger(RabbitMQConsumerErrorFilter.name);

  // Constantes para configuração de reprocessamento
  static readonly RETRY_COUNT_HEADER = 'x-retry-count';
  // Número máximo de tentativas de reprocessamento
  static readonly MAX_RETRIES = 3;
  // Lista de erros que não devem ser reprocessados
  static readonly NON_RETRYABLE_ERRORS = [
    ValidationException,
    BadRequestException,
    UnprocessableEntityException,
  ];

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async catch(exception: Error, host: ArgumentsHost) {
    if (host.getType<'rmq'>() !== 'rmq') return;

    const isNonRetryable =
      RabbitMQConsumerErrorFilter.NON_RETRYABLE_ERRORS.some(
        (e) => exception instanceof e,
      );

    // Erros que não podem ser reprocessados vão direto para DLX
    if (isNonRetryable) {
      this.logger.error(`Erro não retryable: ${exception.message}`);
      return new Nack(false);
    }

    const ctx = host.switchToRpc();
    const message: ConsumeMessage = ctx.getContext();
    const retryCount =
      parseInt(
        message.properties.headers[
          RabbitMQConsumerErrorFilter.RETRY_COUNT_HEADER
        ] as string,
        10,
      ) || 0;

    this.logger.error(`Mensagem com erro. Retry count atual: ${retryCount}`);

    if (retryCount < RabbitMQConsumerErrorFilter.MAX_RETRIES) {
      await this.retry(message, retryCount);
    } else {
      this.logger.error('Máximo de retries atingido. Jogando para DLX.');
      return new Nack(false);
    }
  }

  private async retry(message: ConsumeMessage, previousRetryCount: number) {
    const headers = { ...(message.properties.headers || {}) };
    headers[RabbitMQConsumerErrorFilter.RETRY_COUNT_HEADER] =
      previousRetryCount + 1;
    headers['x-delay'] = 5000; // delay de 5 segundos antes do próximo processamento

    this.logger.debug('Reprocessando mensagem com delay de 5s');

    await this.amqpConnection.publish(
      message.fields.exchange, // publica na mesma exchange de origem
      message.fields.routingKey, // mesma routing key
      message.content,
      {
        correlationId: message.properties.correlationId,
        headers,
      },
    );
  }

  // /**
  //  * Reprocessa a mensagem, incrementando o contador de tentativas no header
  //  * e definindo um delay de 5 segundos antes do próximo processamento. Isso significa
  //  * que a mensagem será reenviada para a fila após 5 segundos, dando tempo para
  //  * que o problema que causou o erro seja resolvido.
  //  */
  // private retry(message: ConsumeMessage) {
  //   const retryCountHeader = RabbitMQConsumerErrorFilter.RETRY_COUNT_HEADER;
  //   const headers = { ...(message.properties.headers || {}) };

  //   const previousRetryCount =
  //     parseInt(headers[retryCountHeader] as string, 10) || 0;
  //   const retryCount = previousRetryCount + 1;

  //   headers[retryCountHeader] = retryCount;

  //   if (REPROCESSABLE_EXCHANGES_WITH_DELAY.includes(message.fields.exchange)) {
  //     /**
  //      * O motivo principal de usar x-delay é:
  //      * - Evitar retry imediato que pode sobrecarregar a fila ou repetir falhas rapidamente.
  //      * - Dar tempo para que problemas temporários se resolvam (ex: banco de dados indisponível, API externa fora do ar).
  //      * - Evitar loop infinito de retries imediatos, que pode gerar muitas mensagens falhando e poluir a DLX.
  //      * - Mensagens com erro + retry sem delay → vão voltar imediatamente para a fila, podem sobrecarregar o consumer se o erro for persistente.
  //      * - Mensagens com erro + retry com x-delay → só serão processadas novamente depois do tempo configurado, dando “respiro” para o sistema.
  //      */
  //     this.logger.debug('Reprocessamento com delay');
  //     headers['x-delay'] = 5000;
  //   }

  //   // Republico a mensagem pra origem
  //   this.logger.debug('Reprocessamento comum');
  //   this.amqpConnection.publish(
  //     message.fields.exchange,
  //     message.fields.routingKey,
  //     message.content,
  //     {
  //       correlationId: message.properties.correlationId,
  //       headers,
  //     },
  //   );
  // }
}

const REPROCESSABLE_EXCHANGES_WITH_DELAY = [
  'orders-topic-exchange',
  'delayed.exchange',
];
