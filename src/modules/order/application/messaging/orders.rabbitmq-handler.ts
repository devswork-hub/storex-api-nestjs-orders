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
  @MessagePattern('order.created')
  async createOrder(@Payload() payload: any, @Ctx() context: RmqContext) {
    console.log('Recebido');
  }
}
