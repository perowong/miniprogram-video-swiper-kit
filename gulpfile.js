const gulp = require('gulp');
const gulpClean = require('gulp-clean');
const build = require('./scripts/build');

function clean() {
  return gulp.src('dist', { read: false, allowEmpty: true }).pipe(gulpClean());
}

exports.default = gulp.series(clean, build);
