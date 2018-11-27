/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import builtins from 'rollup-plugin-node-builtins';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
// import { plugin as analyze } from 'rollup-plugin-analyzer';
import minify from 'rollup-plugin-minify-es';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

let plugins = [
  builtins(),
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
    // analyze(),
    filesize(),
  ]);
}

export default {
  input: 'src/index.js',
  plugins,
  // external: [
  //   '@coda/audio',
  //   '@coda/core',
  //   '@coda/max',
  //   '@coda/midi',
  //   '@coda/ml',
  //   '@coda/myo',
  //   '@coda/ui',
  // ],
  output: {
    file: pkg.main,
    format: 'umd',
    name: 'Playground',
    exports: 'named',
    sourcemap: true,
  },
};
