import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OutboxMongoEntity, OutboxMongoSchema } from './outbox-mongo.entity';
import { OutboxMongoService } from './outbox-mongo.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OutboxMongoEntity.name, schema: OutboxMongoSchema },
    ]),
  ],
  providers: [OutboxMongoService],
  exports: [OutboxMongoService],
})
export class OutboxMongoModule implements OnModuleInit {
  private readonly logger = new Logger(OutboxMongoModule.name);
  onModuleInit() {
    this.logger.log('OutboxMongoModule initialized');
  }
}
