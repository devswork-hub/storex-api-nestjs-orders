import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';

@Catch()
export class RabbitMQConsumerErrorFilter<T = any> implements ExceptionFilter {
  private logger = new Logger(RabbitMQConsumerErrorFilter.name);

  async catch(exception: T, host: ArgumentsHost) {
    this.logger.error('Erro capturado pelo filter', exception);

    if (host.getType<'rmq'>() !== 'rmq') return;

    const ctx = host.switchToRpc();
    const message = ctx.getData();
    const channel = ctx.getContext();

    if (exception instanceof BadRequestException) {
      this.logger.debug('===> Tratando BadRequest, ACK message');
      await channel.ack(message);
    } else {
      this.logger.debug('===> Erro genérico, NACK message');
      await channel.nack(message, false, false);
    }
  }
}
