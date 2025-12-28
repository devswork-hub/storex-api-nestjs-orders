import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('order_idempotency')
export class OrderIdempotencyEntity {
  @PrimaryColumn({ name: 'client_id', length: 64 })
  clientId: string;

  @PrimaryColumn({ name: 'idempotency_key', length: 64 })
  idempotencyKey: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;
}
