export type Either<T, U> = Left<T> | Right<U>;

class Left<T> {
  readonly error: T;

  private constructor(error: T) {
    this.error = error;
  }

  isLeft(): this is Left<T> {
    return true;
  }

  isRight(): this is Right<never> {
    return false;
  }

  static create<U>(error: U): Left<U> {
    return new Left(error);
  }
}

class Right<T> {
  readonly value: T;

  private constructor(value: T) {
    this.value = value;
  }

  isLeft(): this is Left<never> {
    return false;
  }

  isRight(): this is Right<T> {
    return true;
  }

  static create<U>(value: U): Right<U> {
    return new Right(value);
  }
}

export function isLeft<T, U>(either: Either<T, U>): either is Left<T> {
  return either.isLeft();
}
export function isRight<T, U>(either: Either<T, U>): either is Right<U> {
  return either.isRight();
}

function exampleUsage() {
  const success: Either<string, number> = Right.create(42);
  const failure: Either<string, number> = Left.create('Error occurred');

  if (isRight(success)) {
    console.log('Success:', success.value);
  } else if (isLeft(success)) {
    // TypeScript now knows success is Left<string>
    console.log('Failure:', (success as Left<string>).error);
  }

  if (isLeft(failure)) {
    console.log('Failure:', failure.error);
  } else {
    console.log('Success:', (failure as Right<number>).value);
  }
}
