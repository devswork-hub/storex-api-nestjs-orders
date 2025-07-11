// // import { Injectable } from '@golevelup/nestjs-rabbitmq';
// import { Injectable } from '@nestjs/common';
// import { RabbitMQService } from '../../services/rabbitmq/rabbitmq.service';

// @Injectable()
// export class EventBusService {
//   constructor(private readonly rabbitMQService: RabbitMQService) {}
//   async publishEvent(eventName: string, payload: any): Promise<void> {
//     await this.rabbitMQService.publishMessage(
//       'events_exchange',
//       eventName,
//       payload,
//     );
//   }
// }
