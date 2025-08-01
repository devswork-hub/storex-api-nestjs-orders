import { Module } from '@nestjs/common';
import { RabbitMQService } from './rmq-service';

@Module({
  imports: [],
  controllers: [RabbitMQService],
})
export class AppModule {}
