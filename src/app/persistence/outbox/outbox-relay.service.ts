// src/outbox-relay/outbox-relay.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OutboxDocument,
  OutboxEntity,
} from '@/src/modules/order/application/mongo/documents/outbox.document';
import { KafkaProducerService } from './kafka-producer.service';

@Injectable()
export class OutboxRelayService implements OnModuleInit, OnModuleDestroy {
  private interval: NodeJS.Timeout;

  constructor(
    @InjectModel(OutboxEntity.name) private outboxModel: Model<OutboxDocument>,
    private readonly kafkaProducerService: KafkaProducerService, // Injete seu produtor Kafka aqui
  ) {}

  onModuleInit() {
    // Inicia o polling quando o módulo é inicializado
    this.interval = setInterval(() => this.processOutbox(), 5000); // Poll a cada 5 segundos
  }

  onModuleDestroy() {
    // Limpa o intervalo quando o módulo é destruído
    clearInterval(this.interval);
  }

  private async processOutbox() {
    try {
      const unprocessedMessages = await this.outboxModel
        .find({ processed: false })
        .limit(100) // Limitar para não carregar muitas mensagens de uma vez
        .exec();

      for (const message of unprocessedMessages) {
        try {
          // Enviar a mensagem para o tópico Kafka apropriado
          await this.kafkaProducerService.sendMessage(
            'orders_topic', // Seu tópico Kafka
            {
              aggregateType: message.aggregateType,
              aggregateId: message.aggregateId,
              eventType: message.eventType,
              payload: message.payload,
            },
          );

          // Marcar a mensagem como processada
          message.processed = true;
          message.processedAt = new Date();
          await message.save();
          console.log(`Message ${message._id} sent and marked as processed.`);
        } catch (innerError) {
          console.error(
            `Failed to send message ${message._id}:`,
            innerError.message,
          );
          // Opcional: Implementar lógica de retry ou DLQ (Dead Letter Queue)
        }
      }
    } catch (error) {
      console.error('Error processing outbox:', error.message);
    }
  }
}
