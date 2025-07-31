import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from './message-patterns';

@Controller()
export class OrdersRabbitMQController {
  @MessagePattern({ cmd: MESSAGE_PATTERNS.ORDER_CREATED })
  async createOrder(@Payload() payload: any, @Ctx() context: RmqContext) {
    const originalMessage = context.getMessage();
    console.log('Original RabbitMQ message:', originalMessage);
    console.log('📦 Payload completo:', payload); // { pattern, data }
  }
}
