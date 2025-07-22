import * as amqp from 'amqp-connection-manager';

export interface QueueConfig {
  name: string;
  exchange: string;
  routingKey: string;
  options?: amqp.Options.AssertQueue;
  dlq?: boolean;
  retryQueue?: boolean;
}
