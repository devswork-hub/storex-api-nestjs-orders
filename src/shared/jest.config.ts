import type { Config } from 'jest';
import baseConfig from '../../jest.config';

const config: Config = {
  ...baseConfig,
  /**
   * Se você não setar explicitamente, o Jest pode assumir que rootDir é a pasta do jest.config atual (shared/), o que quebra todos os paths que esperam a raiz.
   */
  rootDir: '../../',
  displayName: {
    name: 'Shared Tests',
    color: 'yellow',
  },
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^@/shared//(.*)$': '<rootDir>/shared/$1',
  },
  testMatch: [`${__dirname}/**/*.spec.ts`],
  collectCoverageFrom: [
    '<rootDir>/shared/**/*.spec.ts',
    '!<rootDir>/shared/**/*.d.ts',
    '!<rootDir>/shared/**/__tests__/**',
  ],
};

export default config;
