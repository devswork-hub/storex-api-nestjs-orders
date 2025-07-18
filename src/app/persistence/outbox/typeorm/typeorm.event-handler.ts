import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OutboxEventIntervalSample } from './typeorm-relay.interval';
import { Logger } from '@nestjs/common';

@EventsHandler(OutboxEventIntervalSample)
export class IntervalEventHandler
  implements IEventHandler<OutboxEventIntervalSample>
{
  private readonly logger = new Logger(IntervalEventHandler.name);

  async handle(event: OutboxEventIntervalSample) {
    this.logger.debug('📥 Handler chamado:', event);
  }
}
