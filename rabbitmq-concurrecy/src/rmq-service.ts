import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class RabbitMQService {
  private logger = new Logger(RabbitMQService.name);

  @MessagePattern({ cmd: 'order.created' }) // essa routing key tem que bater com a que foi usada no emissor
  handleOrderCreated(@Payload() data: any) {
    console.log('Recebido tambem');
  }
}
