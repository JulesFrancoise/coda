const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.config.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new UglifyJsPlugin({
      sourceMap: true,
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ],
  devtool: 'source-map',
  externals: {
    '@most/core': {
      commonjs: '@most/core',
      commonjs2: '@most/core',
      amd: '@most/core',
      root: '@most/core',
    },
    '@most/scheduler': {
      commonjs: '@most/scheduler',
      commonjs2: '@most/scheduler',
      amd: '@most/scheduler',
      root: '@most/scheduler',
    },
    '@most/prelude': {
      commonjs: '@most/prelude',
      commonjs2: '@most/prelude',
      amd: '@most/prelude',
      root: '@most/prelude',
    },
    '@most/disposable': {
      commonjs: '@most/disposable',
      commonjs2: '@most/disposable',
      amd: '@most/disposable',
      root: '@most/disposable',
    },
    colormap: {
      commonjs: 'colormap',
      commonjs2: 'colormap',
      amd: 'colormap',
      root: 'colormap',
    },
    vue: {
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
      root: 'vue',
    },
    'vue-template-compiler': {
      commonjs: 'vue-template-compiler',
      commonjs2: 'vue-template-compiler',
      amd: 'vue-template-compiler',
      root: 'vue-template-compiler',
    },
  },
});
