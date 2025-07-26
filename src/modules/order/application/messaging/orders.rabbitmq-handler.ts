import { Controller, ServiceUnavailableException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MESSAGE_PATTERNS } from './message-patterns';

@Controller()
export class OrdersRabbitMQController {
  constructor() {}

  @MessagePattern({ cmd: MESSAGE_PATTERNS.ORDER_CREATED })
  async createOrder(@Payload() payload: any) {
    console.log('📦 Payload completo:', payload); // { pattern, data }
  }
}
