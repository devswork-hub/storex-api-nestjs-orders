import type { Config } from 'jest';

const config: Config = {
  // Faz o Jest mostrar no console o nome de cada teste que está sendo executado.
  verbose: true,
  displayName: {
    name: 'Default Config',
    color: 'blue',
  },

  // Define a raiz do projeto a partir da qual o Jest vai resolver caminhos relativos.
  rootDir: '.',

  /**
   * Sempre que o Jest encontrar um import do tipo: import { Foo } from '@/shared//foo'
   * Ele vai resolver como: <rootDir>/src/shared/foo
   */
  // moduleNameMapper: {
  //   '^@/(.*)$': '<rootDir>/src/$1', // para imports como '@/domain/xyz'
  //   // '^@shared/(.*)$': '<rootDir>/src/shared/$1', // para imports como '@shared/domain/xyz'
  // },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  // Define quais extensões de arquivo o Jest irá resolver automaticamente em imports sem extensão.
  moduleFileExtensions: ['js', 'json', 'ts'],

  // Informa ao Jest como transformar arquivos .ts ou .js para rodar os testes.
  transform: { '^.+\\.(t|j)s$': 'ts-jest' },

  // 'node' simula um ambiente puro Node.js.
  testEnvironment: 'node',
  // Ignora qualquer padrao dentro da pasta
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/build/'],

  collectCoverage: true,
  // Diz ao Jest onde salvar os relatórios de cobertura de testes.
  coverageDirectory: './coverage',
  // O engine V8 (mesmo do Chrome/Node.js) é usado para medir cobertura de forma nativa.
  coverageProvider: 'v8',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/*',
    '!src/**/*.d.ts',
    '!jest.config.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
    // './src/shared/**/*.ts': {
    //   branches: 100,
    //   functions: 100,
    //   lines: 100,
    //   statements: 100,
    // },
  },

  // Utils
  fakeTimers: {
    doNotFake: ['nextTick'],
    timerLimit: 1000,
  },
};

export default config;
