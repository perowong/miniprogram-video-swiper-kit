const path = require('path');

const isDev = process.argv.indexOf('--develop') >= 0;
const src = path.resolve(__dirname, '../src');
const dist = path.resolve(__dirname, '../miniprogram_dist');

const devPath = (proj) =>
  path.resolve(__dirname, `../examples/${proj}/miniprogram_npm/@miniprogram-video-components`);

module.exports = {
  entry: ['index'],

  isDev,
  srcPath: src,
  // distPath: isDev ? dev : dist
  distPath: dist,
  devPath
};
