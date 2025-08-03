import { DomainEventType } from '@/shared/domain/events/domain-event';

export interface MessageBrokerContract {
  publish(event: DomainEventType): Promise<void>;
}
