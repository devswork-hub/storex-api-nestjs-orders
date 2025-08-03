// install fake timers for this file using the options from Jest configuration
jest.useFakeTimers();

test('increase the limit of recursive timers for this and following tests', () => {
  jest.useFakeTimers({ timerLimit: 5000 });
  // ...
});
