import amqp, { Channel, ChannelWrapper } from 'amqp-connection-manager';

interface IEvent {
  key: string; // chave de roteamento usada no RabbitMQ
  [key: string]: any; // demais propriedades opcionais do evento
}

export class ProducerService {
  private channelWrapper: ChannelWrapper;

  constructor() {
    this.connect();
  }

  public async emit(event: IEvent, exchange: string = 'exchange1') {
    const content = event;

    return await this.channelWrapper.publish(exchange, event.key, content, {
      persistent: true,
    });
  }

  async connect() {
    const { RABBITMQ_USER, RABBITMQ_PASSWORD, RABBITMQ_HOST, RABBITMQ_PORT } =
      process.env;
    const url = `amqps://${encodeURIComponent(RABBITMQ_USER)}:${encodeURIComponent(RABBITMQ_PASSWORD)}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

    const connection = amqp.connect(url);
    connection.connect();
    connection.on('connect', () => console.log('Connected!'));
    connection.on('disconnect', (err) => console.log('Disconnected.', err));
    connection.on('connectFailed', (e) => console.log('Connected2doo!', e));

    this.channelWrapper = connection.createChannel({
      setup: async (channel: Channel) => {
        return await channel.assertQueue('CrmQueue', { durable: true });
      },
      json: true,
    });
  }
}
