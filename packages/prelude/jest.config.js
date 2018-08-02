// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
//
// A complete config file can be generated using jest --init

module.exports = {
  // An array of glob patterns indicating a set of files for which coverage information should
  // be collected
  collectCoverageFrom: [
    'src/**/*.{js}',
    '!src/index.js',
    '!**/node_modules/**',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // The test environment that will be used for testing
  testEnvironment: 'node',
};
