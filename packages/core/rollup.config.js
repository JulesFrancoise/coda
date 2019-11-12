/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import { plugin as analyze } from 'rollup-plugin-analyzer';
// import visualizer from 'rollup-plugin-visualizer';
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
    // visualizer(),
  ]);
}

export default {
  input: 'src/index.js',
  plugins,
  external: [
    '@coda/prelude',
    '@ircam/motion-input',
    '@most/core',
    '@most/scheduler',
    '@most/dom-event',
    'complex-js',
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'codaCore',
      sourcemap: true,
      globals: {
        '@coda/prelude': 'codaPrelude',
        '@ircam/motion-input': 'motionInput',
        '@most/core': 'mostCore',
        '@most/scheduler': 'mostScheduler',
        '@most/dom-event': 'mostDomEvent',
        'complex-js': 'complexJs',
      },
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
};
