import { Module, Provider } from '@nestjs/common';
import { OrderMongoRepository } from './order.mongo-repository';
import { UpdateOrderService } from '../domain/usecases/update-order.service';
import { FindOneOrderService } from '../domain/usecases/find-one-order.service';
import { FindAllOrderService } from '../domain/usecases/find-all-order.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrderMongoEntity,
  OrderSchema,
} from './mongo/documents/order.document';
import { OrderResolver } from './graphql/order.resolver';
import { CreateOrderService } from '../domain/usecases/create-order/create-order.service';
import { DeleteOrderService } from '../domain/usecases/delete-order/delete-order.service';
import { DomainSeeders } from './domain.seeders';
import { OrdersSeeder } from './mongo/seeders/orders.seeder';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandHandlers, EventHandlers, QueryHandlers } from './cqrs/handlers';
import { TypeORMModule } from '@/app/persistence/typeorm/typeorm.module';
import { OrdersRabbitMQService } from './messaging/orders.rabbitmq.service';
import { OrdersOutboxRelayService } from './messaging/orders.outbox-relay-cron.service';
import { OrderTypeORMRepository } from './persistence/typeorm/order.typeorm-repository';
import { OutboxModule } from '@/app/persistence/outbox/outbox.module';
// import { OrdersRabbitMQController } from './messaging/orders.rabbitmq-handler';
import { OrdersProjectionService } from './persistence/orders-projection.service';
import { OrdersProjectionCronService } from './persistence/orders-projection-cron.service';
import { MailModule } from '@/app/integrations/mail/mail.module';
import { RabbitmqWrapperModule } from '@/app/messaging/rabbitmq/rabbitmq.wrapper.module';

export const OrderRepositoryProvider: Provider[] = [
  {
    provide: 'OrderRepositoryContract',
    useClass: OrderMongoRepository,
  },
  {
    provide: 'OrderReadableRepositoryContract',
    useClass: OrderTypeORMRepository,
  },
];

export const OrderUseCasesProviders: Provider[] = [
  {
    provide: CreateOrderService,
    useFactory: (repo: any) => new CreateOrderService(repo),
    inject: ['OrderReadableRepositoryContract'],
  },
  {
    provide: UpdateOrderService,
    useFactory: (repo: any) => new UpdateOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
  {
    provide: DeleteOrderService,
    useFactory: (repo: any) => new DeleteOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
  {
    provide: FindOneOrderService,
    useFactory: (repo: any) => new FindOneOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
  {
    provide: FindAllOrderService,
    useFactory: (repo: any) => new FindAllOrderService(repo),
    inject: ['OrderRepositoryContract'],
  },
];

@Module({
  imports: [
    RabbitmqWrapperModule,
    MongooseModule.forFeature([
      {
        name: OrderMongoEntity.name,
        schema: OrderSchema,
      },
    ]),
    CqrsModule,
    OutboxModule.forFeature('typeorm'),
    TypeORMModule,
    MailModule,
  ],
  providers: [
    // OrdersRabbitMQController,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    CreateOrderService,
    FindAllOrderService,
    FindOneOrderService,
    OrderMongoRepository,
    ...OrderRepositoryProvider,
    ...OrderUseCasesProviders,
    OrderResolver,
    DomainSeeders,
    OrdersSeeder,
    OrdersRabbitMQService,
    OrdersOutboxRelayService,
    OrdersProjectionService,
    OrdersProjectionCronService,
  ],
  exports: [...OrderRepositoryProvider, ...OrderUseCasesProviders],
})
export class OrdersModule {}
