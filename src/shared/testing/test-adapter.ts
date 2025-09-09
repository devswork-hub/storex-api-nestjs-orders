// TODO: Remove this file when we drop Jest support

// This file provides a unified interface for testing utilities, allowing the use of either Jest or Vitest.
// It checks for the presence of Vitest's global `vi` object to determine which testing framework is in use.

// Check if Vitest's global `vi` is available
const vi = (globalThis as any).vi;

export const TestAdapter = {
  mockFn: <T extends (...args: any[]) => any>(impl?: T) => {
    return (globalThis as any).vi ? vi.fn(impl) : jest.fn(impl);
  },
  spyOn: (obj: any, method: string) => {
    return (globalThis as any).vi
      ? vi.spyOn(obj, method as any)
      : jest.spyOn(obj, method as any);
  },
  expect: (value: any) => {
    return expect(value);
  },
};
