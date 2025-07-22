import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQConfigService } from './rabbitmq.config.service';
import { RabbitMQPublisher } from './rabbitmq.publisher';
import { RabbitMQConsumer } from './rabbitmq.consumer';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RabbitMQConfigService, RabbitMQPublisher, RabbitMQConsumer],
  controllers: [RabbitMQConsumer],
  exports: [RabbitMQConfigService, RabbitMQPublisher],
})
export class RabbitMQModule {}
