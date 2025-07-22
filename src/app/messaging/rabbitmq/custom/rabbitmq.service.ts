import { Injectable, Logger } from '@nestjs/common';
import type { RabbitMQPublisher } from './rabbitmq.publisher';

export interface CreateOrderDto {
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
}

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly publisher: RabbitMQPublisher) {}

  async createOrder(orderData: CreateOrderDto): Promise<string> {
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      // 1. Persiste o pedido no banco (simulado)
      await this.saveOrderToDatabase(orderId, orderData);

      // 2. Publica eventos para processamento assíncrono
      const results = await this.publisher.publishOrderEvent(
        'created',
        orderId,
        orderData,
        'high', // Alta prioridade para novos pedidos
      );

      // 3. Verifica se todas as publicações foram bem-sucedidas
      const failedPublications = results.filter((r) => !r.success);
      if (failedPublications.length > 0) {
        this.logger.warn(
          `Some events failed to publish for order: ${orderId}`,
          failedPublications,
        );
      }

      this.logger.log(`🎉 Order created successfully: ${orderId}`);
      return orderId;
    } catch (error) {
      this.logger.error(`Failed to create order: ${orderId}`, error);
      throw error;
    }
  }

  private async saveOrderToDatabase(
    orderId: string,
    orderData: CreateOrderDto,
  ): Promise<void> {
    // Simula persistência no banco
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.logger.log(`💾 Order saved to database: ${orderId}`);
  }
}
