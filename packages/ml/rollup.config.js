/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import { plugin as analyze } from 'rollup-plugin-analyzer';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

let plugins = [
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**',
  }),
];
if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    terser(),
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
      '@most/core',
      '@most/scheduler',
      'xmm',
      'ml-pca',
    ],
    output: [
      {
        file: pkg.main,
        format: 'umd',
        name: 'codaMl',
        sourcemap: true,
        globals: {
          '@coda/prelude': 'codaPrelude',
          '@most/core': 'mostCore',
          '@most/scheduler': 'mostScheduler',
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
    input: 'src/operator/xmm.worker.js',
    plugins,
    output: {
      file: 'dist/xmm.worker.js',
      format: 'umd',
      sourcemap: true,
    },
  },
];
