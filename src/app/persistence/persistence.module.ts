import { DynamicModule, Module } from '@nestjs/common';
import { MongooseAppModule } from './mongoose.module';
import { MongooseModule } from '@nestjs/mongoose';

type PersistenceProps = {
  type: 'prisma' | 'mongoose' | 'typeorm';
  global?: boolean;
};

function moduleResolver(type: PersistenceProps['type']) {
  const module: Record<PersistenceProps['type'], any> = {
    mongoose: MongooseModule,
    prisma: undefined,
    typeorm: undefined,
  };
  return module[type];
}

@Module({
  imports: [MongooseAppModule],
})
export class PersistenceModule {
  static async register({
    global = false,
    type,
  }: PersistenceProps): Promise<DynamicModule> {
    return {
      global,
      module: PersistenceModule,
      imports: [moduleResolver(type)],
      exports: [moduleResolver(type)],
    };
  }
}
