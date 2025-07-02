import { Module } from '@nestjs/common';
import { MongooseAppModule } from './mongoose.module';

@Module({
  imports: [MongooseAppModule],
})
export class PersistenceModule {}
