module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': [2, { args: 'after-used', argsIgnorePattern: '^_' }],
    quotes: ['error', 'single', { avoidEscape: true }],
    'prettier/prettier': 'error',
  },
};
