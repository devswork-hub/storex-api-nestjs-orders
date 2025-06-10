import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

export class UUID {
  private readonly id: string;

  constructor(id?: string) {
    this.id = id || uuidv4();
    this.validate();
  }

  private validate() {
    const isValid = uuidValidate(this.id);
    if (!isValid) {
      throw new InvalidUUIDdError();
    }
  }

  get() {
    return this.id;
  }
}

export class InvalidUUIDdError extends Error {
  constructor(message?: string) {
    super(message || 'ID must be a valid UUID');
    this.name = 'InvalidUUIDdError';
  }
}
