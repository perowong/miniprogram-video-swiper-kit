const path = require('path');

const isDev = process.argv.indexOf('--develop') >= 0;
const src = path.resolve(__dirname, '../src');
const dist = path.resolve(__dirname, '../miniprogram_dist');

module.exports = {
  entry: ['index'],

  isDev,
  srcPath: src,
  // distPath: isDev ? dev : dist
  distPath: dist
};
