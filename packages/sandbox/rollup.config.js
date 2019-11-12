/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import { plugin as analyze } from 'rollup-plugin-analyzer';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

let plugins = [
  builtins(),
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
    '@coda/audio',
    '@coda/core',
    '@coda/max',
    '@coda/midi',
    '@coda/ml',
    '@coda/sensors',
    '@coda/ui',
    '@most/scheduler',
    'escodegen',
    'esprima',
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'Playground',
      exports: 'named',
      sourcemap: true,
      globals: {
        '@coda/audio': 'codaAudio',
        '@coda/core': 'codaCore',
        '@coda/max': 'codaMax',
        '@coda/midi': 'codaMidi',
        '@coda/ml': 'codaMl',
        '@coda/sensors': 'codaSensors',
        '@coda/ui': 'codaUi',
        '@most/scheduler': 'mostScheduler',
        escodegen: 'escodegen',
        esprima: 'esprima',
      },
    },
    {
      file: pkg.module,
      name: 'Playground',
      exports: 'named',
      format: 'es',
      sourcemap: true,
    },
  ],
};
