import { ValidationException } from '@/shared/domain/validation/validation-exception';
import { Nack } from '@golevelup/nestjs-rabbitmq';
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

  static readonly RETRY_COUNT_HEADER = 'x-retry-count';
  static readonly MAX_RETRIES = 10;
  static readonly NON_RETRYABLE_ERRORS = [
    ValidationException,
    BadRequestException,
    UnprocessableEntityException,
  ];

  async catch(exception: Error, host: ArgumentsHost) {
    if (host.getType<'rmq'>() !== 'rmq') return;

    const hasRetryableError =
      RabbitMQConsumerErrorFilter.NON_RETRYABLE_ERRORS.some(
        (e) => exception instanceof e,
      );

    if (hasRetryableError) {
      this.logger.error(
        'Possui um erro reprocessavel, jogando pra DLQ ou descartando',
      );
      return new Nack(false);
    }

    const ctx = host.switchToRpc();
    const message: ConsumeMessage = ctx.getContext();

    if (this.shouldRetry(message.properties.headers)) {
    } else {
      return new Nack(false);
    }
  }

  // Verificar se a mensagem deve ser reprocessada
  // Se sim, reprocessar a mensagem
  // Se não, jogar pra DLQ ou descartar
  private shouldRetry(messageHeaders: MessagePropertyHeaders): boolean {
    // Obtém o nome do header que armazena a quantidade de tentativas de reprocessamento
    const retryCountHeader = RabbitMQConsumerErrorFilter.RETRY_COUNT_HEADER;
    // Define o número máximo de tentativas permitidas
    const maxRetries = RabbitMQConsumerErrorFilter.MAX_RETRIES;

    // Retorna true se:
    // - O header de tentativas não existe (primeiro processamento)
    // - Ou o número de tentativas é menor que o máximo permitido
    // Caso contrário, retorna false (não deve reprocessar)
    return (
      !(retryCountHeader in messageHeaders) ||
      parseInt(messageHeaders[retryCountHeader] as string, 10) < maxRetries
    );
  }
}
