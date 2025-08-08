import { ValidationError } from './validator';

export class ValidationException extends Error implements ValidationError {
  public errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super('Validation failed');
    this.errors = errors;
  }
}
