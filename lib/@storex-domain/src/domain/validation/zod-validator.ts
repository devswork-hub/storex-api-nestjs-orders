import { z, ZodSchema, ZodError, ZodFormattedError } from 'zod';
import { ValidationException } from './validation-exception';

export class ZodValidator<T extends ZodSchema<any>> {
  private readonly schema: T;

  constructor(schema: T) {
    this.schema = schema;
  }

  public validate(data: unknown): z.infer<T> {
    try {
      return this.schema.parse(data);
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.format();
        throw new ValidationException(errors);
      }
      throw error;
    }
  }

  private formatErrors(
    formattedError: ZodFormattedError<any>,
  ): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    for (const [key, value] of Object.entries(formattedError)) {
      if (key === '_errors') continue;

      const field = value as { _errors?: string[] };
      if (field?._errors && field._errors.length > 0) {
        errors[key] = field._errors;
      }
    }

    return errors;
  }
}
