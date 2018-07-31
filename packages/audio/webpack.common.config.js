const path = require('path');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'audio',
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
    '@most/core': '@most/core',
    '@most/scheduler': '@most/scheduler',
  },
};
