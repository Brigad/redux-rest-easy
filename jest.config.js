const path = require('path');

const configBase = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: path.join(__dirname, 'coverage'),
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 79,
      statements: 80,
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
