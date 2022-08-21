const gulp = require('gulp');
const config = require('./scripts/config');
const build = require('./scripts/build');
const devWatch = require('./scripts/devWatch');
const cleanWrap = require('./scripts/clean');

exports.devWatch = devWatch;
exports.default = gulp.series(cleanWrap(config.distPath), build);
