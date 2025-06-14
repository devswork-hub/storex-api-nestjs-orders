import { ValueObject } from './value-object';

export abstract class Identifier<T extends Identifier<T>> extends ValueObject {
  private readonly value: string;

  protected constructor(value: string) {
    super();
    this.value = Identifier.validate(value);
  }

  public getValue(): string {
    return this.value;
  }

  public static generate<T extends Identifier<T>>(
    ctor: new (value: string) => T,
  ): T {
    return new ctor(crypto.randomUUID());
  }

  public static from<T extends Identifier<T>>(
    ctor: new (value: string) => T,
    id: string,
  ): T {
    return new ctor(id.toLowerCase());
  }

  private static validate(value: string): string {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!value || !uuidRegex.test(value)) {
      throw new Error('Invalid UUID format');
    }
    return value;
  }

  public equals(other: unknown): boolean {
    return (
      other instanceof Identifier &&
      Object.getPrototypeOf(this) === Object.getPrototypeOf(other) &&
      this.value === other.value
    );
  }

  public hashCode(): number {
    let hash = 0;
    for (let i = 0; i < this.value.length; i++) {
      const chr = this.value.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }
}
