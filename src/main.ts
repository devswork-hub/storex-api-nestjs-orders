import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
// import { DomainSeeders } from './modules/order/application/domain.seeders';
import { TimeoutInterceptor } from './app/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './app/interceptors/logging.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ConfigSchemaType } from './app/config/config.values';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new TimeoutInterceptor(), new LoggingInterceptor());

  // app.connectMicroservice({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: ['amqp://guest:guest@localhost:5672'],
  //     queue: 'order_events', // mesma queue usada no publisher
  //     queueOptions: {
  //       durable: true,
  //     },
  //   },
  // });

  await app.startAllMicroservices(); // importante!

  app.enableCors({
    origin: '*',
    credentials: true,
  });

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
