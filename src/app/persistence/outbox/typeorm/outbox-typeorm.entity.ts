import { Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AbstractEntity } from '../../typeorm/abstract.entity';

@Entity('outbox')
export class OutboxTypeORMEntity extends AbstractEntity<OutboxTypeORMEntity> {
  @Column()
  aggregateType: string;

  @Column()
  aggregateId: string;

  @Column()
  eventType: string;

  @Column('jsonb')
  payload: Record<string, any>;

  @Column({ default: false })
  processed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
