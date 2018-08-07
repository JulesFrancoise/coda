/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import { plugin as analyze } from 'rollup-plugin-analyzer';
import minify from 'rollup-plugin-minify-es';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

let plugins = [
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
    plugins: ['external-helpers'],
  }),
];
if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    minify(),
    filesize(),
    // analyze(),
  ]);
}

export default [
  {
    input: 'src/index.js',
    plugins,
    external: [
      '@coda/prelude',
      '@most/prelude',
      '@most/core',
      '@most/scheduler',
      '@most/dom-event',
      'complex-js',
      'xmm',
      'ml-pca',
    ],
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: 'codaCore',
        sourcemap: true,
        globals: {
          '@coda/prelude': 'codaPrelude',
          '@most/prelude': 'mostPrelude',
          '@most/core': 'mostCore',
          '@most/scheduler': 'mostScheduler',
          '@most/dom-event': 'mostDomEvent',
          'complex-js': 'complexJs',
          xmm: 'xmm',
          'ml-pca': 'PCA',
        },
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
      },
    ],
  },
  {
    input: 'src/operator/ml/xmm.worker.js',
    plugins,
    output: {
      file: 'dist/xmm.worker.js',
      format: 'umd',
      sourcemap: true,
    },
  },
];
