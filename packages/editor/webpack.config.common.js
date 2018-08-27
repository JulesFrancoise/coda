/* eslint-disable import/no-extraneous-dependencies */
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
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './examples/**/*.js', to: './examples/', flatten: true },
      { from: './media/**/*.flac', to: './media/', flatten: true },
      { from: './src/index.html', to: './index.html' },
      { from: './src/css', to: './css' },
      { from: './src/js/jshint.js', to: './jshint.js' },
      { from: './node_modules/@coda/core/dist/xmm.worker.js', to: './xmm.worker.js' },
    ]),
  ],
};
