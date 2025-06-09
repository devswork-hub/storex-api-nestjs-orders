import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OrderItemSeeder } from './orders/api/order-item.seeders';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seeder = app.get(OrderItemSeeder);
  await seeder.seed();

  await app.listen(3000);
}
bootstrap();
