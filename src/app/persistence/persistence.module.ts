import { Module } from '@nestjs/common';
import { MongooseAppModule } from '../modules/database/mongoose.module';

@Module({
  imports: [MongooseAppModule],
})
export class PersistenceModule {}
