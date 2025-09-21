import { Test, TestingModule } from '@nestjs/testing';
import {
  AmqpConnection,
  Nack,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import {
  Injectable,
  UnprocessableEntityException,
  UseFilters,
} from '@nestjs/common';
import { RabbitMQConsumerErrorFilter } from './rabbitmq-consumer-error.filter';
import { RabbitmqWrapperModule } from './rabbitmq.wrapper.module';
import { ConfigModule } from '@/app/config/config.module';

@UseFilters(RabbitMQConsumerErrorFilter)
@Injectable()
class StubConsumer {
  constructor(private readonly filter: RabbitMQConsumerErrorFilter) {}

  @RabbitSubscribe({
    exchange: 'direct.delayed',
    routingKey: 'test.key',
    queue: 'test.queue',
    queueOptions: { durable: false },
  })
  async handle() {
    this.thowError();
  }
  thowError() {}
}

describe('Integration tests / RabbitMQConsumerErrorFilter', () => {
  let filter: RabbitMQConsumerErrorFilter;
  let module: TestingModule;
  let consumer: StubConsumer;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              RABBITMQ_URL: 'amqp://localhost',
              NODE_ENV: 'test',
            }),
          ],
          validate: () => ({}), // evita erro de validation
        }),
        RabbitmqWrapperModule.forRoot({ enableHandlers: true }),
      ],
      providers: [RabbitMQConsumerErrorFilter, StubConsumer],
    }).compile();

    await module.init();

    filter = module.get<RabbitMQConsumerErrorFilter>(
      RabbitMQConsumerErrorFilter,
    );
    consumer = module.get<StubConsumer>(StubConsumer);
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  afterEach(async () => {
    if (module) await module.close();
    jest.clearAllMocks();
  });

  it.skip('should not retry if error is non-retriable', async () => {
    jest.spyOn(consumer, 'thowError').mockImplementation(() => {
      throw new UnprocessableEntityException('Validation failed');
    });

    jest.spyOn(amqpConnection, 'publish').mockImplementation(jest.fn());

    try {
      await consumer.handle();
    } catch (err) {
      const result = await filter.catch(err, {
        getType: () => 'rmq',
        switchToRpc: () => ({
          getContext: () => ({
            properties: { headers: {} },
            fields: { exchange: 'direct.delayed', routingKey: 'test.key' },
            content: Buffer.from('payload'),
          }),
        }),
      } as any);

      expect(result).toEqual(new Nack(false));
      expect(amqpConnection.publish).not.toHaveBeenCalled();
    }
  });
});
