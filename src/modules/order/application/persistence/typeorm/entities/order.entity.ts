import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { OrderItemTypeORMEntity } from './order-item.entity';

@Entity('orders')
export class OrderTypeORMEntity {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 50 })
  status: string; // Usar enum ou string

  @Column({ type: 'jsonb', name: 'payment_snapshot' }) // Armazena snapshots como JSON
  paymentSnapshot: any;

  @Column({ type: 'jsonb', name: 'shipping_snapshot' })
  shippingSnapshot: any;

  @Column({ type: 'jsonb', name: 'billing_address' })
  billingAddress: any;

  @Column({ type: 'jsonb', name: 'customer_snapshot' })
  customerSnapshot: any;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ nullable: true, name: 'payment_id' })
  paymentId: string;

  @Column({ nullable: true, type: 'text' })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  discount?: any;

  @OneToMany(() => OrderItemTypeORMEntity, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItemTypeORMEntity[];

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  deleted: boolean;

  @Column({ nullable: true, name: 'deleted_at' })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
