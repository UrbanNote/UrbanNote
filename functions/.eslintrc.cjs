module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
    '/coverage/**/*', // Ignore coverage reports.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'linebreak-style': ['warn', 'windows'],
    quotes: ['error', 'single'],
    indent: 'off',
    'import/no-unresolved': 0,
    'require-jsdoc': 0,
    'quote-props': ['error', 'as-needed'],
    'object-curly-spacing': ['error', 'always'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'unknown', ['internal', 'parent', 'sibling', 'index']],
        pathGroups: [{ group: 'builtin', pattern: 'react', position: 'before' }],
        pathGroupsExcludedImportTypes: ['builtin'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
};
