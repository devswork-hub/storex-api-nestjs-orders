export abstract class ValueObject {
  abstract equals(other: unknown): boolean;
  abstract hashCode(): number;
}
