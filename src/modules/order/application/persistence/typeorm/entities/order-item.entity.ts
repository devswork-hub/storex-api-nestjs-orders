import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderTypeORMEntity } from './order.entity';

@Entity('order_items')
export class OrderItemTypeORMEntity {
  @PrimaryColumn()
  id: string;

  @ManyToOne(() => OrderTypeORMEntity, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order: OrderTypeORMEntity;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column()
  quantity: number;

  @Column({ type: 'jsonb' })
  price: any; // Armazenar o value object Money em JSON (amount + currency)

  @Column({ nullable: true, type: 'jsonb' })
  discount?: any;

  @Column({ nullable: true })
  seller?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  shippingId?: string;
}
