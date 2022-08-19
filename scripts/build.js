const path = require('path');

const rollup = require('rollup').rollup;
const rollupTerser = require('rollup-plugin-terser').terser;

const gulp = require('gulp');
const gulpLess = require('gulp-less');
const gulpRename = require('gulp-rename');

const config = require('./config');
const checkComponents = require('./checkComponents');
const _ = require('./utils');

let mergedComponentListMap;
async function getComponentListMap() {
  if (mergedComponentListMap) {
    return mergedComponentListMap;
  }

  const entries = config.entry;
  mergedComponentListMap = {};

  for (let i = 0, len = entries.length; i < len; i++) {
    let entry = entries[i];
    entry = path.join(config.srcPath, `${entry}.json`);
    const newComponentListMap = await checkComponents(entry);

    _.merge(mergedComponentListMap, newComponentListMap);
  }

  return mergedComponentListMap;
}

async function buildJs() {
  for (let i = 0; i < mergedComponentListMap.jsFileList.length; i++) {
    const endpoint = mergedComponentListMap.jsFileList[i];
    const bundle = await rollup({
      input: `${config.srcPath}/${endpoint}`,
      plugins: [rollupTerser()]
    });

    await bundle.write({
      file: `${config.distPath}/${endpoint}`,
      format: 'es'
    });
  }
}

async function buildLess() {
  return gulp
    .src(mergedComponentListMap.lessFileList, { cwd: config.srcPath, base: config.srcPath })
    .pipe(gulpLess({ paths: [config.srcPath], compress: true }))
    .pipe(gulpRename({ extname: '.wxss' }))
    .pipe(gulp.dest(config.distPath));
}

async function buildWxml() {
  return gulp
    .src(mergedComponentListMap.wxmlFileList, { cwd: config.srcPath, base: config.srcPath })
    .pipe(gulp.dest(config.distPath));
}

async function buildJson() {
  return gulp
    .src(mergedComponentListMap.jsonFileList, { cwd: config.srcPath, base: config.srcPath })
    .pipe(gulp.dest(config.distPath));
}

module.exports = gulp.series(
  getComponentListMap,
  gulp.parallel(buildJs, buildLess, buildWxml, buildJson)
);
