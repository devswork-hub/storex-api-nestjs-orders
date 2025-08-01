import { Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import { DiscoveryModule, DiscoveryService } from '@golevelup/nestjs-discovery';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { ProducerService } from './emitter.service';

@Module({
  imports: [DiscoveryModule],
  providers: [
    {
      provide: 'QUEUE_LIST',
      useValue: ['CrmQueue'],
    },
    ProducerService,
  ],
  exports: [ProducerService],
})
export class QueueModule implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  private readonly logger = new Logger(QueueModule.name);
  private readonly actionMapper = new Object();

  // Connect to RabbitMQ on Constructor call and handle connection
  constructor(
    private readonly discover: DiscoveryService,
    @Inject('QUEUE_LIST') protected queueList: string[],
  ) {
    const { RABBITMQ_USER, RABBITMQ_PASSWORD, RABBITMQ_HOST, RABBITMQ_PORT } =
      process.env;
    const url = `amqps://${encodeURIComponent(RABBITMQ_USER)}:${encodeURIComponent(RABBITMQ_PASSWORD)}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`;

    const connection = amqp.connect(url);
    connection.on('connect', () =>
      this.logger.log(
        `Inventory Service: Connected to ${queueList.toString()}`,
      ),
    );
    connection.on('connectFailed', () =>
      this.logger.log(
        `Inventory Service: Failed to connect to ${queueList.toString()}`,
      ),
    );

    this.channelWrapper = connection.createChannel({});
  }

  // Scan project and map methods (consumers) using our decorator
  public async onModuleInit() {
    const providers = await this.getProviders();
    // console.log(providers);
    providers.forEach((element) => {
      this.actionMapper[element.meta.routingKey] = {
        class: element.discoveredMethod.parentClass.instance,
        method: element.discoveredMethod.handler,
      };
      this.logger.log(
        `Subscriber Assingnment: ${element.meta.routingKey} -> ${element.discoveredMethod.parentClass.name}::${element.discoveredMethod.methodName}`,
      );
    });

    this.setConsumers();
  }

  // Scan methods within classes using decorators with this meta: AMQP_SUBSCRIBER
  async getProviders() {
    return await this.discover.providerMethodsWithMetaAtKey<any>(
      'AMQP_SUBSCRIBER',
    );
  }

  // Attach callbacks to Rabbit MQ Routing Keys (events names)
  async setConsumers() {
    try {
      console.log(this.queueList);
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue(this.queueList[0], { durable: true });
        await channel.assertExchange('exchange1', 'topic');

        channel.consume(this.queueList[0], async (message) => {
          // Bind Meesges here;
          console.log('Received message:', message.content.toString());

          if (message) {
            const JsondMessage = JSON.parse(message.content.toString());
            console.log(JsondMessage, 'Parsed Message');

            const rtk = message.fields.routingKey;
            if (message.fields.routingKey in this.actionMapper) {
              const classy = this.actionMapper[message.fields.routingKey].class;
              const method =
                this.actionMapper[message.fields.routingKey].method;
              method.call(classy, rtk, JsondMessage);
            }
            channel.ack(message);
          }
        });
      });
      this.logger.log('Consumer service started and listening for messages.');
    } catch (error) {
      this.logger.error('Failed to start listeners.', error);
    }
  }
}
