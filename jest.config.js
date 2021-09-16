module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.vue'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/src/main.ts', '<rootDir>/src/registerServiceWorker.ts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFiles: ['jest-canvas-mock'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  testMatch: ['**/tests/**/*.test.ts'],
};
