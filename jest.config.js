// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
//
// A complete config file can be generated using jest --init

module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    'packages/**/*.{js}',
    '!**/node_modules/**',
  ],
  roots: ['packages/'],
};
