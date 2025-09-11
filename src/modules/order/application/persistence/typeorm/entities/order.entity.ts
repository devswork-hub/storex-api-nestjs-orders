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

  @Column({ type: 'jsonb' }) // Armazena snapshots como JSON
  paymentSnapshot: any;

  @Column({ type: 'jsonb' })
  shippingSnapshot: any;

  @Column({ type: 'jsonb' })
  billingAddress: any;

  @Column({ type: 'jsonb' })
  customerSnapshot: any;

  @Column()
  customerId: string;

  @Column({ nullable: true })
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

  @Column({ nullable: true })
  deletedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
