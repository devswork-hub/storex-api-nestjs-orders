import amqp from 'amqplib';
import { Observable } from 'rxjs';

export class RabbitMQService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private channelConsumer: amqp.Channel | null = null;

  constructor() {
    this.connect();
  }

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(
        'amqp://myuser:secret@localhost:5673',
      );
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue('order-queue');
      console.log('RabbitMQ connected');
    } catch (err) {
      console.error('Failed to connect to RabbitMQ:', err.message);
    }
  }

  async publishMessage(queue: string, message: any): Promise<void> {
    if (!this.channel) {
      console.error('No RabbitMQ channel available.');
      await this.connect(); // Tentar reconectar
      return;
    }

    try {
      await this.channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
      );
    } catch (err) {
      console.error('Failed to publish message:', err);
    }
  }

  async consumeMessages(
    queue: string,
    callback?: (message: any) => void,
  ): Promise<Observable<any>> {
    if (!this.channel) {
      await this.connect();
      return;
    }
    await this.channel.consume(queue, (message) => {
      if (message) {
        const content = message.content.toString();
        if (callback) {
          const parsedContent = JSON.parse(content);
          callback(parsedContent);
        }
        this.channel!.ack(message);
      }
    });
  }
}
