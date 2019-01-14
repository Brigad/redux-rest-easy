const path = require('path');

module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: path.join(__dirname, 'coverage'),
  coverageThreshold: {
    global: {
      statements: 81,
      branches: 89,
      functions: 88,
      lines: 81,
    },
  },
  moduleDirectories: ['node_modules'],
  rootDir: __dirname,
  roots: [__dirname],
  testRegex: '\\.test\\.js$',
};
