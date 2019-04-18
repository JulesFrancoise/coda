/* eslint-disable import/no-extraneous-dependencies */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./coda.config');

let copyList = [
  { from: './node_modules/@coda/sandbox/dist/xmm.worker.js', to: './xmm.worker.js' },
  { from: './node_modules/@coda/sandbox/dist/xmm.worker.js.map', to: './xmm.worker.js.map' },
];

if (Object.keys(config).includes('projects')) {
  const projectsFileList = config.projects.concat(['Examples']).map(project => [
    { from: `./projects/${project}/scripts/**/*.js`, to: './examples/', flatten: true },
    { from: `./projects/${project}/media/**/*.flac`, to: './media/', flatten: true },
    { from: `./projects/${project}/media/**/*.wav`, to: './media/', flatten: true },
    { from: `./projects/${project}/media/**/*.ogg`, to: './media/', flatten: true },
    { from: `./projects/${project}/media/**/*.mp3`, to: './media/', flatten: true },
    { from: `./projects/${project}/media/**/*.json`, to: './media/', flatten: true },
  ]).reduce((a, b) => a.concat(b), []);
  copyList = copyList.concat(projectsFileList);
}

module.exports = {
  runtimeCompiler: true,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin(copyList),
    ],
  },
  pages: {
    index: {
      entry: 'src/main.js',
      filename: 'index.html',
    },
    signin: {
      entry: 'src/main.js',
      filename: 'device/index.html',
    },
  },
  css: { extract: false },
};
