import { Injectable, Logger } from '@nestjs/common';
import { OrdersSeeder } from './mongo/seeders/orders.seeder';

@Injectable()
export class DomainSeeders {
  private readonly logger = new Logger(DomainSeeders.name);

  constructor(
    private readonly ordersSeeder: OrdersSeeder,
    // INFO: adicionar outros seeders aqui
  ) {}

  async run() {
    this.logger.log('Iniciando execução dos seeders...');

    await this.ordersSeeder.seed();

    // await this.outroSeeder.seed(); ← exemplo
    this.logger.log('Seed finalizado.');
  }
}
