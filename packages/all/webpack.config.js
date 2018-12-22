const path = require('path');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: './src/index.js',
  // plugins: [
  //   new BundleAnalyzerPlugin(),
  // ],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default',
    library: 'coda',
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
};
