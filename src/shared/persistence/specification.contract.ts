// export interface Specification<T> {
//   and(other: T): Promise<T>;
//   andOrNot(other: T): Promise<T>;
//   or(other: T): Promise<T>;
//   orNot(other: T): Promise<T>;
//   not(): Promise<T>;
//   isSatisfiedBy(candidate: T): boolean;
// }
// export abstract class CompositeSpecification<T> implements Specification<T> {
//   public abstract isSatisfiedBy(candidate: T): boolean;

//   /**
//    * Combines this specification with another using a logical AND.
//    * @param other The other specification.
//    * @returns A new specification representing the logical AND.
//    */
//   public and(other: Specification<T>): Specification<T> {
//     return new AndSpecification<T>(this, other);
//   }

//   /**
//    * Combines this specification with the negation of another using a logical AND.
//    * Equivalent to `this AND (NOT other)`.
//    * @param other The other specification to negate.
//    * @returns A new specification representing the logical AND NOT.
//    */
//   public andNot(other: Specification<T>): Specification<T> {
//     return new AndSpecification<T>(this, new NotSpecification<T>(other));
//   }

//   /**
//    * Combines this specification with another using a logical OR.
//    * @param other The other specification.
//    * @returns A new specification representing the logical OR.
//    */
//   public or(other: Specification<T>): Specification<T> {
//     return new OrSpecification<T>(this, other);
//   }

//   /**
//    * Combines this specification with the negation of another using a logical OR.
//    * Equivalent to `this OR (NOT other)`.
//    * @param other The other specification to negate.
//    * @returns A new specification representing the logical OR NOT.
//    */
//   public orNot(other: Specification<T>): Specification<T> {
//     return new OrSpecification<T>(this, new NotSpecification<T>(other));
//   }

//   /**
//    * Negates this specification.
//    * @returns A new specification representing the logical NOT.
//    */
//   public not(): Specification<T> {
//     return new NotSpecification<T>(this);
//   }

//   /**
//    * Provides a string representation of the specification.
//    * This is useful for debugging or logging the applied rules.
//    */
//   public abstract toString(): string;
// }

// export class AndSpecification<T> extends CompositeSpecification<T> {
//   constructor(
//     private readonly left: Specification<T>,
//     private readonly right: Specification<T>,
//   ) {
//     super();
//   }

//   public isSatisfiedBy(candidate: T): boolean {
//     return (
//       this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate)
//     );
//   }

//   public toString(): string {
//     return `(${this.left.toString()} AND ${this.right.toString()})`;
//   }
// }

// export class OrSpecification<T> extends CompositeSpecification<T> {
//   constructor(
//     private readonly left: Specification<T>,
//     private readonly right: Specification<T>,
//   ) {
//     super();
//   }

//   public isSatisfiedBy(candidate: T): boolean {
//     return (
//       this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate)
//     );
//   }

//   public toString(): string {
//     return `(${this.left.toString()} OR ${this.right.toString()})`;
//   }
// }

// export class NotSpecification<T> extends CompositeSpecification<T> {
//   constructor(private readonly other: Specification<T>) {
//     super();
//   }

//   public isSatisfiedBy(candidate: T): boolean {
//     return !this.other.isSatisfiedBy(candidate);
//   }

//   public toString(): string {
//     return `(NOT ${this.other.toString()})`;
//   }
// }

// export class RangeSpecification<T> extends CompositeSpecification<T> {
//   constructor(
//     private readonly min: T,
//     private readonly max: T,
//   ) {
//     super();
//   }

//   public isSatisfiedBy(candidate: T): boolean {
//     // This assumes T can be compared directly using >= and <=.
//     // For more complex types, you might need a custom comparison function or a different approach.
//     return candidate >= this.min && candidate <= this.max;
//   }

//   public toString(): string {
//     return `(RANGE ${this.min} TO ${this.max})`;
//   }
// }
