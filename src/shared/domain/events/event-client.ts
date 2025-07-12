import { IEventHandler } from './event-handler';
import { IEventPublisher } from './event-publisher';

export const EVENT_CLIENT_INJECTION_TOKEN = 'EVENT_CLIENT_INJECTION_TOKEN';

export type IEventClient = IEventHandler & IEventPublisher;
