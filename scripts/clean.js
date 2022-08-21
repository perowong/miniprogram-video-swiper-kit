const gulp = require('gulp');
const gulpClean = require('gulp-clean');

module.exports = function cleanWrap(dist) {
  return function clean() {
    return gulp.src(dist, { read: false, allowEmpty: true }).pipe(gulpClean())
  };
}
