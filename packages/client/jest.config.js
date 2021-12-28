/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.vue'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/src/main.ts'],
  coverageThreshold: {
    global: {},
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  setupFiles: ['jest-canvas-mock'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
};
