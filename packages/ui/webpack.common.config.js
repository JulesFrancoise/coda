const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  mode: 'none',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: '@coda/core',
  },
  plugins: [
    new VueLoaderPlugin(),
  ],
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
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },
  externals: {
    '@coda/prelude': '@coda/prelude',
    '@most/scheduler': '@most/scheduler',
    '@most/disposable': '@most/disposable',
    vue: 'vue',
    'vue-template-compiler': 'vue-template-compiler',
  },
};
