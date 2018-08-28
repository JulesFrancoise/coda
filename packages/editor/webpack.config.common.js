/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const userExamples = fs.readdirSync('examples')
  .filter(x => x.slice(x.length - 3, x.length) === '.js')
  .map(x => x.slice(0, x.length - 3));
const defaultExamples = fs.readdirSync('examples/_default')
  .filter(x => x.slice(x.length - 3, x.length) === '.js')
  .map(x => x.slice(0, x.length - 3));


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
    new HtmlWebpackPlugin({
      inject: false,
      userExamples,
      defaultExamples,
      // Load a custom template (lodash by default see the FAQ for details)
      template: 'src/index.html',
    }),
    new CopyWebpackPlugin([
      { from: './examples/**/*.js', to: './examples/', flatten: true },
      { from: './media/**/*.flac', to: './media/', flatten: true },
      { from: './media/**/*.json', to: './media/', flatten: true },
      { from: './src/css', to: './css' },
      { from: './src/js/jshint.js', to: './jshint.js' },
      { from: './node_modules/@coda/ml/dist/xmm.worker.js', to: './xmm.worker.js' },
    ]),
  ],
};
