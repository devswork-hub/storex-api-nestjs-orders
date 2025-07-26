import { DynamicModule, Module } from '@nestjs/common';
import { OutboxMongoModule } from './mongo/outbox-mongo.module';
import { OutboxTypeORMModule } from './typeorm/typeorm-outbox.module';
import { OutboxCronExecutorService } from './outbox-cron-executor.service';

type OutboxProviderType = 'mongoose' | 'typeorm';

const AVAILABLE_MODULES: Record<OutboxProviderType, any> = {
  mongoose: OutboxMongoModule,
  typeorm: OutboxTypeORMModule,
};

@Module({})
export class OutboxModule {
  /**
   * Registra globalmente os módulos de Outbox desejados.
   */
  static register(options: { provider: OutboxProviderType[] }): DynamicModule {
    const resolvedModules = this.resolveModules(options.provider);

    return {
      module: OutboxModule,
      imports: resolvedModules,
      providers: [OutboxCronExecutorService],
      exports: [...resolvedModules, OutboxCronExecutorService],
    };
  }

  /**
   * Registra um único módulo de Outbox como dependência local.
   */
  static forFeature(provider: OutboxProviderType): DynamicModule {
    return this.register({ provider: [provider] });
  }

  /**
   * Resolve uma lista de módulos com base nos providers especificados.
   */
  private static resolveModules(providers: OutboxProviderType[]): any[] {
    return providers.map((key) => {
      const mod = AVAILABLE_MODULES[key];
      if (!mod) {
        throw new Error(`OutboxModule: unsupported provider "${key}"`);
      }
      return mod;
    });
  }
}
