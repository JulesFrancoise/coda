/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import { plugin as analyze } from 'rollup-plugin-analyzer';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import VuePlugin from 'rollup-plugin-vue';
import pkg from './package.json';

let plugins = [
  resolve(),
  commonjs(),
  VuePlugin(),
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true,
    sourceMap: true,
    extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue'],
  }),
];
if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    terser(),
    // analyze(),
    filesize(),
  ]);
}

export default {
  input: 'src/index.js',
  plugins,
  external: [
    '@coda/prelude',
    '@most/disposable',
    '@most/scheduler',
    'colormap',
    'vue',
    'vue-awesome',
    'vue-template-compiler',
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'codaUi',
      sourcemap: true,
      globals: {
        '@coda/prelude': 'codaPrelude',
        '@most/disposable': 'mostDisposable',
        '@most/scheduler': 'mostScheduler',
        colormap: 'colormap',
        vue: 'Vue',
        'vue-awesome': 'vueAwesome',
        'vue-template-compiler': 'vueTemplateCompiler',
      },
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
};
