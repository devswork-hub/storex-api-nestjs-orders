import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxTypeORMEntity } from './outbox-typeorm.entity';
import { OutboxTypeORMService } from './outbox-typeorm.service';
import { TypeORMOutboxCronProcessorService } from './typeorm-outbox-processor.service';
import { TypeORMOutboxIntervalProcessorService } from './typeorm-relay.interval';
import { IntervalEventHandler } from './typeorm.event-handler';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [TypeOrmModule.forFeature([OutboxTypeORMEntity]), CqrsModule],
  providers: [
    OutboxTypeORMService,
    // TypeORMOutboxCronProcessorService, // Só precisa de @Injectable + @Cron
    // TypeORMOutboxIntervalProcessorService, // Só precisa de @Injectable + setInterval
    // IntervalEventHandler, // handler registrado via CqrsModule
  ],
  exports: [
    OutboxTypeORMService, // usado fora, por isso exporta
    // TODO: exportar somente se outros modulos precisarem do cron ou interval processor
    // TypeORMOutboxCronProcessorService,
    // TypeORMOutboxIntervalProcessorService,
    // IntervalEventHandler,
  ],
})
export class OutboxTypeORMModule implements OnModuleInit {
  private readonly logger = new Logger(OutboxTypeORMModule.name);
  onModuleInit() {
    this.logger.log('OutboxTypeORMModule ');
  }
}
