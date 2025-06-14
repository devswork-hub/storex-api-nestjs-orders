import { z, ZodSchema, ZodError } from 'zod';
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
}
