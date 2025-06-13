import { ValidationException } from './validation-exception';

export type ValidationError = {
  errors: Record<string, string[]>;
};

export class Validator implements ValidationError {
  public errors: Record<string, string[]> = {};

  public addError(attribute: string, message: string): void {
    if (!this.errors[attribute]) {
      this.errors[attribute] = [];
    }
    this.errors[attribute].push(message);
  }

  public hasMin(
    attribute: string,
    value: string | null,
    length: number,
    message: string,
  ): void {
    if (value !== null && value.length < length) {
      this.addError(attribute, message);
    }
  }

  public hasMax(
    attribute: string,
    value: string,
    length: number,
    message: string,
  ): void {
    if (value.length > length) {
      this.addError(attribute, message);
    }
  }

  public hasLength(
    attribute: string,
    length: number,
    value: string | null,
    message: string,
  ): void {
    if (value !== null && value.length !== length) {
      this.addError(attribute, message);
    }
  }

  public isRequired(attribute: string, value: string | null): void {
    if (value === null || String(value).trim() === '') {
      this.addError(attribute, `attribute '${attribute}' is required`);
    }
  }

  public isValidEmail(
    attribute: string,
    email: string | null,
    message: string,
  ): void {
    const pattern = /^(.+)@(\S+)$/;

    if (email !== null) {
      const isValid = pattern.test(email);
      if (!isValid) {
        this.addError(attribute, message);
      }
    }
  }

  public nonNull(attribute: string, value: any): void {
    if (value === null) {
      this.addError(attribute, `attribute '${attribute}' not be null`);
    }
  }

  public shouldBeNull(attribute: string): void {
    this.addError(attribute, `attribute '${attribute}' has to be null`);
  }

  public isNull(attribute: string, value: any): void {
    if (value === null) {
      this.addError(attribute, `attribute '${attribute}' has to be null`);
    }
  }

  public isString(attribute: string, value: string) {
    if (typeof value !== 'string') {
      this.addError(attribute, `attribute '${attribute}' has be a string`);
    }
  }

  public validate(): boolean {
    if (Object.keys(this.errors).length > 0) {
      const errorsCopy = { ...this.getAllErrors() };
      this.clearErrors();
      throw new ValidationException(errorsCopy);
    }
    return true;
  }

  public getErrorsByAttribute(attribute: string): string[] {
    return this.errors[attribute] || [];
  }

  public getAllErrors(): Record<string, string[]> {
    return this.errors;
  }

  public clearErrors(): void {
    this.errors = {};
  }
}
