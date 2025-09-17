import { StubClass } from '@/shared/testing/stub';
import { DomainEvent } from './domain-event';
import { fakeId } from '@/shared/testing/fake-id';

class CustomDomainEvent extends DomainEvent<StubClass> {
  constructor() {
    super('TestEvent', fakeId, { id: fakeId });
  }
}

describe('DomainEvent', () => {
  it('should create a domain event instance', () => {
    const instance = new CustomDomainEvent();
    expect(instance).toBeDefined();
    expect(instance).toMatchObject({
      eventType: 'TestEvent',
      aggregateId: fakeId,
      payload: { id: fakeId },
    });
  });
});
