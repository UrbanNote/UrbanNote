import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  // ts-jest generated config
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['src/**/*.ts'],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    'node_modules',
    'tests',
    'src/errors.ts',
    'Repository\\.ts$',
    'Controller\\.ts$',
    'Observer\\.ts$',
    'index\\.ts$',
    'Doc\\.ts$',
    'Details\\.ts$',
    'src/baseEntity.ts',
    'src/container.ts',
    'src/storage/fileMetadata.ts',
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: ['json', 'text', 'lcov', 'clover'],

  // An object that configures minimum threshold enforcement for coverage results
  // ce serait bien de mettre le minimum dont on parle dans notre DoD
  coverageThreshold: undefined,
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: 80,
  //   },
  // },
};

export default config;
