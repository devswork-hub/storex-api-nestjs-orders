import { UUID } from '../value-objects/uuid.vo';

export type EntityProps = {
  id?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Entity implements EntityProps {
  id?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: EntityProps) {
    this.id = props?.id || new UUID().toString();
    this.active = props?.active ?? true;
    this.createdAt = props?.createdAt || new Date();
    this.updatedAt = props?.updatedAt || new Date();
  }
}
