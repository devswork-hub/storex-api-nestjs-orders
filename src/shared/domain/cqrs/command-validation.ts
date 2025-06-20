import { Validator } from '../validation/validator';

export abstract class CommandValidation<T> {
  protected validation: Validator;

  constructor() {
    this.validation = new Validator();
  }

  abstract validate(command: T): void;
}
