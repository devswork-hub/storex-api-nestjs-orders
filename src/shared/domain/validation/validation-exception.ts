import { ValidationError } from './validator';

export class ValidationException extends Error implements ValidationError {
  public readonly errors: Record<string, string[]>;

  constructor(errors: Record<string, string[]>) {
    super('Validation failed');
    this.name = 'ValidationException';
    this.errors = errors;

    // Corrige o stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationException);
    }
  }

  toString(): string {
    const messages = Object.entries(this.errors)
      .map(([key, errs]) => `${key}: ${errs.join(', ')}`)
      .join('\n');
    return `${this.name}:\n${messages}`;
  }
}
