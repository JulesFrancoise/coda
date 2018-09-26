const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        { from: './examples/**/*.js', to: './examples/', flatten: true },
        { from: './media/**/*.flac', to: './media/', flatten: true },
        { from: './media/**/*.json', to: './media/', flatten: true },
        { from: './node_modules/@coda/sandbox/dist/xmm.worker.js', to: './xmm.worker.js' },
        { from: './node_modules/@coda/sandbox/dist/xmm.worker.js.map', to: './xmm.worker.js.map' },
      ]),
    ],
  },
  css: { extract: false },
};
