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
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.json'],
  },
  externals: {
    '@most/core': '@most/core',
    '@most/scheduler': '@most/scheduler',
    '@most/dom-event': '@most/dom-event',
    '@most/prelude': '@most/prelude',
    '@most/disposable': '@most/disposable',
    'xebra.js': 'xebra.js',
    myo: 'myo',
    tonal: 'tonal',
  },
};
