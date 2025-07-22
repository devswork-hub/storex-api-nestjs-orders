// import { Injectable } from '@nestjs/common';
// import { RabbitMQConfigService } from './rabbitmq.config.service';

// @Injectable()
// export class RabbitMQPublisher {
//   constructor(private readonly rabbitConfig: RabbitMQConfigService) {}

//   async publish<T>(routingKey: string, message: T) {
//     await this.rabbitConfig
//       .getChannel()
//       .publish(
//         'orders_exchange',
//         routingKey,
//         Buffer.from(JSON.stringify(message)),
//       );
//   }
// }
