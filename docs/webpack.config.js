const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  context: __dirname,
  entry: './src/index.js',
  plugins: [
    new CopyWebpackPlugin([{
      from: './node_modules/@coda/sandbox/dist/xmm.worker.js',
      to: 'xmm.worker.js',
    }, {
      from: './node_modules/@coda/sandbox/dist/xmm.worker.js.map',
      to: 'xmm.worker.js.map',
    }]),
  ],
  output: {
    filename: 'sandbox.js',
    path: path.resolve(__dirname, '.vuepress/public/'),
    publicPath: '/',
    libraryTarget: 'umd',
    globalObject: 'this',
    libraryExport: 'default',
    library: 'sandbox',
  },
};
