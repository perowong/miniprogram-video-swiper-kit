const gulp = require('gulp');
const minimist = require('minimist');
const fs = require('fs-extra');
const config = require('./config');
const cleanWrap = require('./clean');

const argv = minimist(process.argv.slice(2));


const devSrc = config.devPath(argv.proj);

function watchCallback(cb) {
  fs.emptyDirSync(config.distPath);
  fs.copy(config.srcPath, devSrc);
  typeof cb === 'function' && cb();
}

function watch() {
  console.log('watch proj: ', argv.proj);

  return gulp.watch('./src/**/*')
  .on('change', watchCallback)
  .on('add', watchCallback)
  .on('unlink', watchCallback);
}


module.exports = gulp.series(cleanWrap(devSrc), watchCallback, watch);
