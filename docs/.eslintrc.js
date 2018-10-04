module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
  },
  plugins: ['html'],
  extends: 'airbnb-base',
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        vue: 'never',
      },
    ],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
  globals: {},
};
