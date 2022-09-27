const fs = require('fs-extra');
const path = require('path');
const _ = require('./utils');

const srcPath = path.join(__dirname, '../src');
const srcList = fs.readdirSync(srcPath);

const rootPkgJson = _.readJson(path.join(__dirname, '../package.json'));

srcList.forEach((file) => {
  const stat = fs.lstatSync(path.join(srcPath, file));
  if (stat.isDirectory() && file !== 'weui-wxss') {
    const p = path.join(srcPath, file, 'package.json');
    if (fs.existsSync(p)) {
      const pkgJson = _.readJson(p);
      pkgJson.version = rootPkgJson.version;

      _.writeFile(p, JSON.stringify(pkgJson, null, 2));
      console.log(p, `=> upgrade version: ${pkgJson.version}`);
    }
  }
});
