import { randomUUID } from 'crypto';

export class UUID {
  private readonly id: string;

  constructor(id?: string) {
    if (id && !this.validate(id)) {
      throw new InvalidUUIDError();
    }
    this.id = id || randomUUID();
  }

  private validate(id: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    return uuidRegex.test(id);
  }

  public toString(): string {
    return this.id;
  }
}

export class InvalidUUIDError extends Error {
  constructor(message?: string) {
    super(message || 'ID must be a valid UUID');
    this.name = 'InvalidUUIDError';
  }
}
