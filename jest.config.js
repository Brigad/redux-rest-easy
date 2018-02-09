const path = require('path');

const configBase = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: path.join(__dirname, 'coverage'),
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
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
