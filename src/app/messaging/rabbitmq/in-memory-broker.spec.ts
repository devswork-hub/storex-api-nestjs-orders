import { Test } from '@nestjs/testing';
import { InMemoryBroker } from './in-memory-broker';
import { DomainEventType } from '@/shared/domain/events/domain-event';
import { OrderCreatedEvent } from '@/modules/order/domain/events/order-created.event';

describe('InMemoryBroker', () => {
  let broker: InMemoryBroker;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: 'IMessageBroker',
          useClass: InMemoryBroker,
        },
      ],
    }).compile();

    broker = moduleRef.get<InMemoryBroker>('IMessageBroker');
  });

  it('should call the subscribed handler when event is published', async () => {
    const eventMock: DomainEventType = {
      eventType: 'OrderCreatedEvent',
      payload: { userId: '123' },
      eventId: '',
      aggregateId: '',
      occurredOn: undefined,
    };

    const handler = jest.fn(async (_event) => {});

    broker.subscribe(OrderCreatedEvent, handler);

    await broker.publish(eventMock);

    expect(handler).toHaveBeenCalledWith(eventMock);
  });
});
