import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderMongoEntity } from '../documents/order.document';

@Injectable()
export class OrdersSeeder {
  constructor(
    @InjectModel(OrderMongoEntity.name)
    private readonly model: Model<OrderMongoEntity>,
  ) {}
  async seed() {
    const count = await this.model.countDocuments();
    if (count > 0) return; // evita duplicação

    await this.model.insertMany([
      {
        _id: 'order1',
        customerId: 'customer1',
        items: [
          {
            productId: 'product1',
            quantity: 2,
            price: { amount: 100, currency: 'USD' },
            title: 'Produto 1',
            imageUrl: 'http://example.com/product1.jpg',
          },
          {
            productId: 'product2',
            quantity: 1,
            price: { amount: 50, currency: 'USD' },
            title: 'Produto 2',
            imageUrl: 'http://example.com/product2.jpg',
          },
        ],
        status: 'PENDING',
      },
    ] as OrderMongoEntity[]);

    console.log('[seed] OrderItem criado com sucesso.');
  }

  async run() {}
}
