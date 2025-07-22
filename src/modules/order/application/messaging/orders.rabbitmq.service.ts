// import { Inject } from '@nestjs/common';
// import {
//   ClientProxy,
//   ClientProxyFactory,
//   Transport,
// } from '@nestjs/microservices';

import { RABBIT_ORDERS_SERVICE } from '@/src/app/messaging/rabbitmq/rabbitmq.module';
import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { MESSAGE_PATTERNS } from './message-patterns';

// export class OrdersRabbitMQService {
//   private client: ClientProxy;

//   constructor() {
//     this.client = ClientProxyFactory.create({
//       transport: Transport.RMQ,
//       options: {
//         urls: ['amqp://localhost:5672'],
//         queue: 'orders_queue',
//         queueOptions: {
//           durable: false,
//         },
//       },
//     });
//   }

//   async createUser(data) {
//     const user = await this.prisma.user.create({ data });
//     this.client.emit('user_created', user);
//     return user;
//   }
// }

// @()
// export class EmailService {
//   @EventPattern('user_created')
//   async handleUserCreated(data: any) {
//     console.log('New user created, sending email to:', data.email);
//     // Here you can call an actual email service to send emails
//   }
// }

// @EventPattern('user_created')
// async handleUserCreated(data: any) {
//   try {
//     // process the event
//   } catch (error) {
//     throw new Error('Failed to process event');
//   }
// }

@Injectable()
export class OrdersRabbitMQService {
  private logger = new Logger(OrdersRabbitMQService.name);
  onModuleInit() {
    console.log('OrdersRabbitMQController iniciado');
  }

  constructor(
    @Inject(RABBIT_ORDERS_SERVICE) private readonly client: ClientProxy,
  ) {}
  sendMessage(data: any) {
    try {
      this.client
        .emit({ cmd: MESSAGE_PATTERNS.ORDER_CREATED }, data)
        .subscribe({
          complete: () => {
            this.logger.log(`Evento 'order.created' emitido com sucesso.`);
          },
          error: (err) => {
            this.logger.error(`Erro ao emitir evento 'order.created'`, err);
          },
        });
    } catch (error) {
      throw new ServiceUnavailableException(
        'Service unavailable, please try again later',
      );
    }
  }
}
