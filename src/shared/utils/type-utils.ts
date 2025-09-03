/**
 * Links
 * - https://github.com/gustavoguichard/string-ts
 */

export type ChangeTo<A, B> = {
  [K in keyof A]: K extends keyof B ? B[K] : A[K];
};

// TODO: mover para o local adequado
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? T extends Lowercase<T>
      ? `${T}${CamelToSnakeCase<U>}`
      : `_${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S;

export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S;

export type ObjectKeysToSnakeCase<T> = {
  [K in keyof T as CamelToSnakeCase<string & K>]: T[K];
};

const test: CamelToSnakeCase<'helloWorldTest'> = 'hello_world_test';
const test2: SnakeToCamelCase<'hello_world_test'> = 'helloWorldTest';
const test3: ObjectKeysToSnakeCase<{
  helloWorld: string;
  anotherTest: number;
}> = {
  hello_world: 'string',
  another_test: 123,
};
