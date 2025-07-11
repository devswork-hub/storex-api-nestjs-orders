import amqp, { Channel, Connection, ConsumeMessage } from 'amqplib';

export class RabbitMQService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  constructor(
    private readonly url: string = process.env.RABBITMQ_URL ||
      'amqp://myuser:secret@localhost:5673',
  ) {}

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
      console.log('[RabbitMQ] Connection established');
    } catch (error) {
      console.error('[RabbitMQ] Failed to connect:', (error as Error).message);
    }
  }

  private async getChannel(): Promise<Channel> {
    if (!this.channel) {
      await this.connect();
      if (!this.channel)
        throw new Error(
          '[RabbitMQ] Channel not available after reconnect attempt',
        );
    }
    return this.channel;
  }

  async assertQueue(queue: string): Promise<void> {
    const channel = await this.getChannel();
    await channel.assertQueue(queue, { durable: true });
  }

  async publishMessage(queue: string, message: unknown): Promise<void> {
    const channel = await this.getChannel();
    await this.assertQueue(queue);

    try {
      const sent = channel.sendToQueue(
        queue,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
        },
      );

      if (!sent) {
        console.warn(`[RabbitMQ] Message to queue "${queue}" was not sent`);
      }
    } catch (error) {
      console.error(
        `[RabbitMQ] Failed to publish message to "${queue}":`,
        error,
      );
    }
  }

  async consumeMessages(
    queue: string,
    callback: (message: unknown) => void,
  ): Promise<void> {
    const channel = await this.getChannel();
    await this.assertQueue(queue);

    await channel.consume(
      queue,
      (msg: ConsumeMessage | null) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            callback(content);
            channel.ack(msg);
          } catch (error) {
            console.error('[RabbitMQ] Failed to process message:', error);
            channel.nack(msg, false, false); // descarta a mensagem
          }
        }
      },
      { noAck: false },
    );
  }

  async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('[RabbitMQ] Connection closed');
    } catch (error) {
      console.error('[RabbitMQ] Failed to close connection:', error);
    }
  }
}
