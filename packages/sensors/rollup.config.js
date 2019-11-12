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
    // analyze(),
    filesize(),
  ]);
}

export default {
  input: 'src/index.js',
  plugins,
  external: [
    '@coda/prelude',
    '@coda/core',
    '@ircam/motion-input',
    '@most/scheduler',
    'leapjs',
    'myo',
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'codaLeap',
      sourcemap: true,
      globals: {
        '@coda/prelude': 'codaPrelude',
        '@coda/core': 'codaCore',
        '@ircam/motion-input': 'motionInput',
        '@most/scheduler': 'mostScheduler',
        leapjs: 'leapjs',
        myo: 'myo',
      },
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
};
