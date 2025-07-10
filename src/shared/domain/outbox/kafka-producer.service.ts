// src/outbox-relay/kafka-producer.service.ts
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'my-orders-app',
      brokers: ['localhost:9092'], // Substitua pelos seus brokers Kafka
    });
    this.producer = this.kafka.producer();
    this.producer.connect().catch(console.error);
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    const record: ProducerRecord = {
      topic,
      messages: [{ value: JSON.stringify(message) }],
    };
    await this.producer.send(record);
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
