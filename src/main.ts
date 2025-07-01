import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DomainSeeders } from './modules/order/application/domain.seeders';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // if (process.env.RUN_SEED === 'true') {
  //   const seeder = app.get(DomainSeeders);
  //   await seeder.run();
  //   await app.close(); // encerra após o seed
  //   return;
  // }

  await app.listen(3000);
}
bootstrap();
