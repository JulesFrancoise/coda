module.exports = function babelConfig(api) {
  // api.cache(true);

  const targets = {
    browsers: api.env('production')
      ? ['> 1 %']
      : ['last 4 chrome version', 'last 4 firefox version'],
  };

  const presets = [
    ['@babel/preset-env', { targets }],
  ];
  const plugins = ['@babel/plugin-proposal-object-rest-spread'];

  return {
    presets,
    plugins,
    // modules: isTest,
  };
};
