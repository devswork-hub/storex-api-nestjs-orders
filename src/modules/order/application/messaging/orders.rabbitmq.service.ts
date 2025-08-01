import { RMQ_ORDERS_SERVICE } from '@/src/app/messaging/rabbitmq/rabbitmq.module';
import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from './message-patterns';

@Injectable()
export class OrdersRabbitMQService {
  private logger = new Logger(OrdersRabbitMQService.name);

  constructor(
    @Inject(RMQ_ORDERS_SERVICE) private readonly client: ClientProxy,
  ) {}
  sendMessage(data: any) {
    try {
      this.client.emit(MESSAGE_PATTERNS.ORDER_CREATED, data).subscribe({
        complete: () =>
          this.logger.log(`Evento 'order.created' emitido com sucesso.`),
        error: (err) =>
          this.logger.error(`Erro ao emitir evento 'order.created'`, err),
      });
    } catch (error) {
      throw new ServiceUnavailableException(
        'Service unavailable, please try again later',
      );
    }
  }
}
