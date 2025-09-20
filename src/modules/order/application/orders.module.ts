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
import { OrdersRabbitMQController } from './messaging/orders.rabbitmq-handler';
import { OrdersProjectionService } from './persistence/orders-projection.service';
import { OrdersProjectionCronService } from './persistence/orders-projection-cron.service';
import { MailModule } from '@/app/integrations/mail/mail.module';
import { RabbitmqWrapperModule } from '@/app/messaging/rabbitmq/rabbitmq.wrapper.module';
import {
  OrderReadableRepositoryContract,
  OrderWritableRepositoryContract,
} from './persistence/order.respository';

export const OrderRepositoryProvider: Provider[] = [
  {
    provide: 'OrderReadableRepositoryContract',
    useClass: OrderMongoRepository,
  },
  {
    provide: 'OrderWritableRepositoryContract',
    useClass: OrderTypeORMRepository,
  },
];

export const OrderUseCasesProviders: Provider[] = [
  {
    provide: CreateOrderService,
    useFactory: (repo: OrderWritableRepositoryContract) =>
      new CreateOrderService(repo),
    inject: ['OrderWritableRepositoryContract'],
  },
  {
    provide: UpdateOrderService,
    useFactory: (repo: OrderWritableRepositoryContract) =>
      new UpdateOrderService(repo),
    inject: ['OrderWritableRepositoryContract'],
  },
  {
    provide: DeleteOrderService,
    useFactory: (repo: OrderWritableRepositoryContract) =>
      new DeleteOrderService(repo),
    inject: ['OrderWritableRepositoryContract'],
  },
  {
    provide: FindOneOrderService,
    useFactory: (repo: OrderReadableRepositoryContract) =>
      new FindOneOrderService(repo),
    inject: ['OrderReadableRepositoryContract'],
  },
  {
    provide: FindAllOrderService,
    useFactory: (repo: OrderReadableRepositoryContract) =>
      new FindAllOrderService(repo),
    inject: ['OrderReadableRepositoryContract'],
  },
];

@Module({
  imports: [
    RabbitmqWrapperModule.forRoot(),
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
    OrdersRabbitMQController,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
    // CreateOrderService,
    // FindAllOrderService,
    // FindOneOrderService,
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
