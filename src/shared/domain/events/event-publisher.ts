import { BaseEvent } from './base-event';

export interface IEventPublisher {
  publish<T extends BaseEvent>(event: T['type'], data: T): void;
}
