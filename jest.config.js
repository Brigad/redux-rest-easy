const path = require('path');

const configBase = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: path.join(__dirname, 'coverage'),
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 85,
      lines: 80,
    },
  },
  moduleDirectories: ['node_modules'],
  rootDir: __dirname,
  roots: [__dirname],
  testRegex: '\\.test\\.js$',
};

const configJUnit = process.env.JEST_JUNIT_OUTPUT
  ? {
      testResultsProcessor: 'jest-junit',
    }
  : {};

module.exports = Object.assign({}, configBase, configJUnit);
