// zod-validator.test.ts
import { z } from 'zod';
import { ValidationException } from '../validation-exception';
import { ZodValidator } from '../zod-validator';

describe('ZodValidator', () => {
  const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
  });

  it('deve validar com sucesso dados válidos', () => {
    const validator = new ZodValidator(userSchema);

    const data = {
      name: 'João',
      email: 'joao@email.com',
    };

    const result = validator.validate(data);

    expect(result).toEqual(data);
  });

  it('deve lançar ValidationException com erros formatados', () => {
    const validator = new ZodValidator(userSchema);

    const invalidData = {
      name: 'J',
      email: 'invalido',
    };

    try {
      validator.validate(invalidData);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationException);
      expect(e.errors.name._errors[0]).toMatch(/at least 2 character/i);
      expect(e.errors.email._errors[0]).toMatch(/Invalid email/i);
    }
  });
});
