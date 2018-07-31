const path = require('path');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: '@coda/core',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.json'],
  },
  externals: {
    '@coda/prelude': '@coda/prelude',
    '@most/prelude': '@most/prelude',
    '@most/core': '@most/core',
    '@most/scheduler': '@most/scheduler',
    '@most/dom-event': '@most/dom-event',
  },
};
