import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['dist', 'node_modules'],
  coverageReporters: ['json-summary', 'lcov', 'text'],
  // coverageThreshold: {
  //   global: {
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //     statements: 100
  //   }
  // },
  moduleDirectories: [
    '__fixtures__',
    '__mocks__',
    '__tests__',
    'node_modules',
    'src'
  ],
  moduleFileExtensions: ['js', 'ts'],
  moduleNameMapper: {
    '^__fixtures__/(.*)$': '<rootDir>/__fixtures__/$1',
    '^__mocks__/(.*)$': '<rootDir>/__mocks__/$1',
    '^__tests__/(.*)$': '<rootDir>/__tests__/$1',
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  preset: 'ts-jest',
  reporters: ['default', 'jest-junit'],
  resolver: 'ts-jest-resolver',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['dist', 'node_modules'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.eslint.json'
      }
    ]
  },
  verbose: true
}

export default jestConfig
