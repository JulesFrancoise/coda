module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    jest: true
  },
  // plugins: ['html'],
  // extends: 'airbnb-base',
  extends: [
    'airbnb-base',
    // 'plugin:vue/essential',
    // '@vue/airbnb',
  ],
  // add your custom rules here
  rules: {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      js: 'never',
      mjs: 'never',
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
  },
};
