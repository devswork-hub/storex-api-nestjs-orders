import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, type RmqContext } from '@nestjs/microservices';
import { RabbitMQPublisher } from './rabbitmq.publisher';

interface OrderMessage {
  orderId: string;
  event: string;
  data: any;
  timestamp: string;
}

@Controller()
export class RabbitMQConsumer {
  private readonly logger = new Logger(RabbitMQConsumer.name);

  constructor(private readonly publisher: RabbitMQPublisher) {}

  @MessagePattern({ cmd: 'order.created.payment' })
  async handlePaymentProcessing(data: OrderMessage, context: RmqContext) {
    return this.processWithRetry(
      'Payment Processing',
      data,
      context,
      this.processPayment.bind(this),
    );
  }

  @MessagePattern({ cmd: 'order.created.inventory' })
  async handleInventoryCheck(data: OrderMessage, context: RmqContext) {
    return this.processWithRetry(
      'Inventory Check',
      data,
      context,
      this.checkInventory.bind(this),
    );
  }

  @MessagePattern({ cmd: 'order.created.notification' })
  async handleNotification(data: OrderMessage, context: RmqContext) {
    return this.processWithRetry(
      'Notification',
      data,
      context,
      this.sendNotification.bind(this),
      { maxRetries: 5, retryDelay: 10000 }, // Notificações podem ter mais tentativas
    );
  }

  private async processWithRetry(
    processName: string,
    data: OrderMessage,
    context: RmqContext,
    processor: (data: OrderMessage) => Promise<void>,
    options: { maxRetries?: number; retryDelay?: number } = {},
  ) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    const { maxRetries = 3, retryDelay = 30000 } = options;

    const startTime = Date.now();
    const retries = message.properties.headers?.['x-retries'] || 0;
    const correlationId = message.properties.correlationId;

    try {
      this.logger.log(
        `🔄 Processing ${processName} for order: ${data.orderId} (attempt ${retries + 1})`,
      );

      await processor(data);

      const processingTime = Date.now() - startTime;
      this.logger.log(
        `✅ ${processName} completed for order: ${data.orderId} in ${processingTime}ms`,
      );

      channel.ack(message);

      // Métricas de sucesso (aqui você integraria com Prometheus)
      this.recordMetric('message_processed_success', {
        processor: processName.toLowerCase().replace(' ', '_'),
        processing_time: processingTime,
        retries: retries,
      });
    } catch (error) {
      const processingTime = Date.now() - startTime;
      this.logger.error(
        `❌ ${processName} failed for order: ${data.orderId}`,
        error,
      );

      if (retries < maxRetries) {
        // Retry com backoff exponencial
        const delay = Math.min(retryDelay * Math.pow(2, retries), 300000); // Max 5 minutes

        this.logger.warn(
          `🔄 Retrying ${processName} for order: ${data.orderId} in ${delay}ms (attempt ${retries + 1}/${maxRetries})`,
        );

        // Publica para retry queue com delay
        await this.publisher.publishToDirect('payment.retry', data, {
          correlationId,
          headers: {
            'x-retries': retries + 1,
            'x-original-queue':
              message.properties.headers?.['x-original-queue'] || 'unknown',
            'x-retry-delay': delay,
            'x-error': error.message,
          },
          expiration: delay.toString(),
        });

        channel.ack(message); // Remove da fila original
      } else {
        // Máximo de tentativas atingido - envia para DLQ
        this.logger.error(
          `💀 Max retries exceeded for ${processName}, order: ${data.orderId}. Sending to DLQ.`,
        );

        channel.nack(message, false, false); // Vai para DLQ automaticamente

        // Métricas de falha
        this.recordMetric('message_processed_failure', {
          processor: processName.toLowerCase().replace(' ', '_'),
          processing_time: processingTime,
          retries: retries,
          error: error.message,
        });
      }
    }
  }

  // Implementações dos processadores específicos
  private async processPayment(data: OrderMessage): Promise<void> {
    // Simula processamento de pagamento
    await this.simulateProcessing(2000);

    // Simula falha ocasional para demonstrar retry
    if (Math.random() < 0.3) {
      throw new Error('Payment gateway temporarily unavailable');
    }

    this.logger.log(`💳 Payment processed for order: ${data.orderId}`);
  }

  private async checkInventory(data: OrderMessage): Promise<void> {
    // Simula verificação de estoque
    await this.simulateProcessing(1500);

    // Simula falha ocasional
    if (Math.random() < 0.2) {
      throw new Error('Inventory service timeout');
    }

    this.logger.log(`📦 Inventory checked for order: ${data.orderId}`);
  }

  private async sendNotification(data: OrderMessage): Promise<void> {
    // Simula envio de notificação
    await this.simulateProcessing(1000);

    // Simula falha ocasional
    if (Math.random() < 0.1) {
      throw new Error('Email service unavailable');
    }

    this.logger.log(`📧 Notification sent for order: ${data.orderId}`);
  }

  private async simulateProcessing(delay: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private recordMetric(metricName: string, labels: Record<string, any>) {
    // Aqui você integraria com Prometheus/StatsD
    this.logger.debug(`📊 Metric: ${metricName}`, labels);
  }
}
