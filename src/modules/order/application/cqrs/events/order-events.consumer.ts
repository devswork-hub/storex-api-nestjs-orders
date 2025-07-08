// src/modules/order/infrastructure/order-events.consumer.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';

@Controller()
export class OrderEventsConsumer {
  @EventPattern('order.created')
  async handleOrderCreated(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('[RabbitMQ] Evento recebido: order.created', data);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    // ack da mensagem, importante pra não reenviar
    channel.ack(originalMsg);
  }
}
