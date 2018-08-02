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
  commonjs({
    // browser: true,
    // preferBuiltins: false,
    // namedExports: {
    //   // left-hand side can be an absolute path, a path
    //   // relative to the current directory, or the name
    //   // of a module in node_modules
    //   'waves-audio': ['audioContext'],
    // },
  }),
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
  external: [
    '@coda/prelude',
    '@most/core',
    '@most/scheduler',
    'waves-audio',
    'waves-loaders',
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'codaAudio',
      sourcemap: true,
      globals: {
        '@coda/prelude': 'codaPrelude',
        '@most/core': 'mostCore',
        '@most/scheduler': 'mostScheduler',
        'waves-audio': 'wavesAudio',
        'waves-loaders': 'wavesLoaders',
      },
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
};
