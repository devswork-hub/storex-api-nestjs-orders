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
import { ConsumeMessage } from 'amqplib';

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
    const headers = { ...message.properties.headers };
    const retryCount = previousRetryCount + 1;
    headers[RabbitMQConsumerErrorFilter.RETRY_COUNT_HEADER] = retryCount;

    // Pegando o delay original definido no header ou default 10s
    const originalDelay =
      parseInt(headers['x-original-delay'] as string, 10) || 10000;

    // Calculando backoff exponencial: delay = originalDelay * 2^(retryCount-1)
    const backoffDelay = originalDelay * Math.pow(2, retryCount - 1);
    headers['x-delay'] = backoffDelay;

    // Guardar o delay original no header para próximas tentativas
    if (!headers['x-original-delay']) {
      headers['x-original-delay'] = originalDelay;
    }

    this.logger.debug(
      `Reprocessando mensagem com retry #${retryCount}, delay de ${backoffDelay}ms`,
    );

    await this.amqpConnection.publish(
      message.fields.exchange,
      message.fields.routingKey,
      message.content,
      {
        correlationId: message.properties.correlationId,
        headers,
      },
    );
  }
}
