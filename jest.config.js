module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', 'src/**/*.vue'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.vue$': 'vue-jest',
  },
  testMatch: ['**/tests/**/*.test.ts'],
};
