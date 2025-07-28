import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
// import { DomainSeeders } from './modules/order/application/domain.seeders';
import { TimeoutInterceptor } from './app/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './app/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ConfigSchemaType } from './app/config/config.values';
import { Transport } from '@nestjs/microservices';
import { configureMicroservices } from './app/messaging/rabbitmq/listeners';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new TimeoutInterceptor(), new LoggingInterceptor());

  // isso configra os listeners do RabbitMQ // @MessagePattern('orders.*'), @EventPattern('payments.*')
  configureMicroservices(app);

  await app.startAllMicroservices();

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://outra-origin.com',
      'https://mais-uma.com',
    ],
    credentials: true,
  });
  const isProd = process.env.NODE_ENV === 'production';

  app.useLogger(isProd ? ['error', 'warn'] : ['log', 'error', 'warn', 'debug']);

  const configService = app
    .select(AppModule)
    .get(ConfigService<ConfigSchemaType>);

  // TODO: corrigir servico de criacao de dados fakes
  // if (process.env.RUN_SEED === 'true') {
  //   const seeder = app.get(DomainSeeders);
  //   await seeder.run();
  //   await app.close(); // encerra após o seed
  //   return;
  // }

  await app.listen(configService.get('APP_PORT'));
}
bootstrap();
