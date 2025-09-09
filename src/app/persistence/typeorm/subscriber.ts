import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { Logger } from '@nestjs/common';

@EventSubscriber()
export abstract class BaseLogSubscriber<T>
  implements EntitySubscriberInterface<T>
{
  protected readonly logger = new Logger(BaseLogSubscriber.name);

  constructor(protected readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  /**
   * Cada filho vai dizer qual entidade ele escuta
   */
  abstract listenTo(): Function;

  beforeInsert(event: InsertEvent<T>) {
    this.logger.log(
      `[${this.listenTo().name}] beforeInsert: ${JSON.stringify(event.entity)}`,
    );
  }

  afterInsert(event: InsertEvent<T>) {
    this.logger.log(
      `[${this.listenTo().name}] afterInsert: ${JSON.stringify(event.entity)}`,
    );
  }

  beforeUpdate(event: UpdateEvent<T>) {
    this.logger.log(
      `[${this.listenTo().name}] beforeUpdate: ${JSON.stringify(event.entity)}`,
    );
  }

  afterUpdate(event: UpdateEvent<T>) {
    this.logger.log(
      `[${this.listenTo().name}] afterUpdate: ${JSON.stringify(event.entity)}`,
    );
  }

  beforeRemove(event: RemoveEvent<T>) {
    this.logger.log(
      `[${this.listenTo().name}] beforeRemove: ${JSON.stringify(event.entity)}`,
    );
  }

  afterRemove(event: RemoveEvent<T>) {
    this.logger.log(
      `[${this.listenTo().name}] afterRemove: ${JSON.stringify(event.entity)}`,
    );
  }
}
