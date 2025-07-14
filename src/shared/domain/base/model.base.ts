import { UUID } from '../value-objects/uuid.vo';
import { AggregateRoot } from './aggregate-root';

/**
 * O BaseModel é o mesmo que o Entity no Domain Driven Design
 */
export type BaseModelProps = {
  id?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;
};

export class BaseModel<T> extends AggregateRoot implements BaseModelProps {
  id?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?: Date;

  constructor(props: BaseModelProps) {
    super();
    this.id = props?.id || new UUID().toString();
    this.active = props?.active ?? true;
    this.createdAt = props?.createdAt || new Date();
    this.updatedAt = props?.updatedAt || new Date();
    this.deleted = props?.deleted ?? false;
    this.deletedAt = props?.deletedAt || undefined;
  }

  /**
   * Marca a entidade como deletada (soft delete)
   */
  softDelete() {
    this.deleted = true;
    this.deletedAt = new Date();
    this.updatedAt = new Date();
    this.active = false; // opcional: inativa junto com delete
  }

  /**
   * Restaura uma entidade que havia sido soft-deleted
   */
  restore() {
    this.deleted = false;
    this.deletedAt = undefined;
    this.updatedAt = new Date();
    this.active = true; // opcional: ativa ao restaurar
  }

  /**
   * Verifica se o objeto foi "removido"
   */
  isDeleted(): boolean {
    return this.deleted === true;
  }
}
