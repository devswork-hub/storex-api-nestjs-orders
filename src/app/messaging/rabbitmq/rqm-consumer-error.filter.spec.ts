import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQConsumerErrorFilter } from './rabbitmq-consumer-error.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { ArgumentsHost, BadRequestException } from '@nestjs/common';

describe('Unit test / RabbitMQConsumerErrorFilter', () => {
  let filter: RabbitMQConsumerErrorFilter;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQConsumerErrorFilter,
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    filter = moduleFixture.get<RabbitMQConsumerErrorFilter>(
      RabbitMQConsumerErrorFilter,
    );
    amqpConnection = moduleFixture.get<AmqpConnection>(AmqpConnection);
  });
  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('@Catch', () => {
    it('should not retry if error is no-retriable', async () => {
      const host = {
        getType: jest.fn().mockReturnValue('rmq'),
        switchToRpc: jest.fn(),
      } as unknown as ArgumentsHost;

      const error = new BadRequestException();
      const result = await filter.catch(error, host);
      expect(result).toEqual(new Nack(false));
      expect(host.getType).toHaveBeenCalled();
      expect(host.switchToRpc).not.toHaveBeenCalled();
    });

    it('should retry if error is retriable and retry count is less than max retries', async () => {
      const host = {
        getType: jest.fn().mockReturnValue('rmq'),
        switchToRpc: jest.fn().mockReturnValue({
          getContext: jest.fn().mockReturnValue({
            properties: { headers: { 'x-retry-count': 1 } },
            fields: { exchange: 'direct.delayed', routingKey: 'test' },
            content: Buffer.from('test'),
          }),
        }),
      } as unknown as ArgumentsHost;

      await filter.catch(new Error('Test error'), host);
      expect(amqpConnection.publish).toHaveBeenCalledWith(
        'direct.delayed',
        'test',
        Buffer.from('test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-retry-count': 2,
            'x-delay': 20000, // 10s * 2^(2-1)
            'x-original-delay': 10000,
          }),
        }),
      );
    });

    it('should nack if max retries exceeded', async () => {
      const host = {
        getType: jest.fn().mockReturnValue('rmq'),
        switchToRpc: jest.fn().mockReturnValue({
          getContext: jest.fn().mockReturnValue({
            properties: { headers: { 'x-retry-count': 3 } },
            fields: { exchange: 'direct.delayed', routingKey: 'test' },
            content: Buffer.from('test'),
          }),
        }),
      } as unknown as ArgumentsHost;

      const result = await filter.catch(new Error('Persistent error'), host);
      expect(result).toEqual(new Nack(false));
      expect(amqpConnection.publish).not.toHaveBeenCalled();
    });

    it('should retry with default headers if x-retry-count is not set', async () => {
      const host = {
        getType: jest.fn().mockReturnValue('rmq'),
        switchToRpc: jest.fn().mockReturnValue({
          getContext: jest.fn().mockReturnValue({
            properties: { headers: {} },
            fields: { exchange: 'direct.delayed', routingKey: 'test' },
            content: Buffer.from('test'),
          }),
        }),
      } as unknown as ArgumentsHost;

      await filter.catch(new Error('First error'), host);

      expect(amqpConnection.publish).toHaveBeenCalledWith(
        'direct.delayed',
        'test',
        Buffer.from('test'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-retry-count': 1,
            'x-delay': 10000, // default originalDelay * 2^(1-1)
            'x-original-delay': 10000,
          }),
        }),
      );
    });

    it('should ignore if host type is not rmq', async () => {
      const host = {
        getType: jest.fn().mockReturnValue('http'),
      } as unknown as ArgumentsHost;

      const result = await filter.catch(new Error('Other error'), host);
      expect(result).toBeUndefined();
    });
  });
});
