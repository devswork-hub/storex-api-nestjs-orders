import { PrimaryColumn } from 'typeorm';

export class AbstractEntity<T> {
  @PrimaryColumn()
  id: number;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
