import { Controller } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';

@Controller()
export class KafkaConsumer {
  constructor(@Inject('KAFKA_SERVICE') private client: ClientProxy) {}

  @MessagePattern('order-events') // topic ou key que seu producer usar
  handle(message: any) {
    /* … */
  }
}
