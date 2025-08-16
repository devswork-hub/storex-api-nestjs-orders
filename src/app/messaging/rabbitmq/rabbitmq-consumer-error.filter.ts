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

@Catch()
export class RabbitMQConsumerErrorFilter implements ExceptionFilter {
  private logger = new Logger(RabbitMQConsumerErrorFilter.name);

  // acrescentar conforme necessario
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
  }
}
