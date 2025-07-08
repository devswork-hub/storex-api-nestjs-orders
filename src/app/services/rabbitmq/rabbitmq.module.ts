import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../../config/config.module';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitmqModule {}
