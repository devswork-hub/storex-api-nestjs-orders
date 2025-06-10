import { UUID } from './value-objects/uuid.vo';

export type BaseModelProps = {
  id?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export class BaseModel implements BaseModelProps {
  id?: string;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: BaseModelProps) {
    this.id = props?.id || new UUID().get();
    this.active = props?.active ?? true;
    this.createdAt = props?.createdAt || new Date();
    this.updatedAt = props?.updatedAt || new Date();
  }
}
