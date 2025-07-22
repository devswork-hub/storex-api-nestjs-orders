import * as amqp from 'amqp-connection-manager';

export interface ExchangeConfig {
  name: string;
  type: 'direct' | 'topic' | 'fanout';
  options?: amqp.Options.AssertExchange;
}
