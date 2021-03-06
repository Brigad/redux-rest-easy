const path = require('path');

module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  coverageDirectory: path.join(__dirname, 'coverage'),
  coverageThreshold: {
    global: {
      statements: 84,
      branches: 90,
      functions: 88,
      lines: 83,
    },
  },
  moduleDirectories: ['node_modules'],
  rootDir: __dirname,
  roots: [__dirname],
  testRegex: '\\.test\\.js$',
};
