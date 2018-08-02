const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    filename: 'solar.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './examples/**/*.js', to: './examples/', flatten: true },
      { from: './media/**/*.wav', to: './media/', flatten: true },
      { from: './src/index.html', to: './index.html' },
      { from: './src/css', to: './css' },
      { from: './src/js/jshint.js', to: './jshint.js' },
      { from: './node_modules/@coda/core/dist/xmm.worker.js', to: './xmm.worker.js' },
    ]),
  ],
};
