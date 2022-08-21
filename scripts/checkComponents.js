const path = require('path');

const _ = require('./utils');
const config = require('./config');

const srcPath = config.srcPath;

/**
 * acquire the json's path
 */
function getPathInfo(entryPath, ext) {
  const dirPath = path.dirname(entryPath);
  const fileName = path.basename(entryPath, ext || '.json');
  const relative = path.relative(srcPath, dirPath);
  const fileBase = path.join(relative, fileName);

  return {
    dirPath,
    fileName,
    relative,
    fileBase
  };
}

/**
 * check custom components is included
 */
const checkProps = ['usingComponents', 'componentGenerics', 'customAssets'];
async function checkIncludedComponents(entryPath, componentListMap) {
  let dirPath, fileName, fileBase;

  if (entryPath.indexOf('.json') > -1) {
    const json = _.readJson(entryPath);
    if (!json) throw new Error(`json is not valid: "${entryPath}"`);

    const jsonInfo = getPathInfo(entryPath, '.json');
    dirPath = jsonInfo.dirPath;
    fileName = jsonInfo.fileName;
    fileBase = jsonInfo.fileBase;

    for (let i = 0, len = checkProps.length; i < len; i++) {
      const checkProp = checkProps[i];
      const checkPropValue = json[checkProp] || {};
      const keys = Object.keys(checkPropValue);

      for (let j = 0, jlen = keys.length; j < jlen; j++) {
        const key = keys[j];
        let value =
          typeof checkPropValue[key] === 'object' ? checkPropValue[key].default : checkPropValue[key];
        if (!value) continue;

        value = _.transformPath(value, path.sep);

        let componentPath = `${path.join(dirPath, value)}.json`;
        let isExists = await _.checkFileExists(componentPath);
        if (isExists) {
          await checkIncludedComponents(componentPath, componentListMap);
        }

        componentPath = `${path.join(dirPath, value)}`;
        isExists = await _.checkFileExists(componentPath);
        if (isExists) {
          await checkIncludedComponents(componentPath, componentListMap);
        }
      }
    }
  } else if (entryPath.indexOf('.png') > -1) {
    const jsonInfo = getPathInfo(entryPath, '.png');
    dirPath = jsonInfo.dirPath;
    fileName = jsonInfo.fileName;
    fileBase = jsonInfo.fileBase;
  } else {
    return;
  }

  let exists = await _.checkFileExists(path.join(dirPath, `${fileName}.wxml`));
  if (exists) {
    componentListMap.wxmlFileList.push(`${fileBase}.wxml`);
  }
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.wxss`));
  exists && componentListMap.wxssFileList.push(`${fileBase}.wxss`);
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.less`));
  exists && componentListMap.lessFileList.push(`${fileBase}.less`);
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.json`));
  exists && componentListMap.jsonFileList.push(`${fileBase}.json`);
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.js`));
  exists && componentListMap.jsFileList.push(`${fileBase}.js`);
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.ts`));
  if (exists && componentListMap.tsFileList.indexOf(`${fileBase}.ts`) < 0) {
    componentListMap.tsFileList.push(`${fileBase}.ts`);
  }

  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.js`));
  exists && (componentListMap.jsFileMap[fileBase] = `${path.join(dirPath, fileName)}.js`);
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.ts`));
  exists && (componentListMap.jsFileMap[fileBase] = `${path.join(dirPath, fileName)}.ts`);

  // assets
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.png`));
  exists && componentListMap.assetsList.push(`${path.join(dirPath, fileName)}.png`);
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.jpg`));
  exists && componentListMap.assetsList.push(`${path.join(dirPath, fileName)}.jpg`);
  exists = await _.checkFileExists(path.join(dirPath, `${fileName}.svg`));
  exists && componentListMap.assetsList.push(`${path.join(dirPath, fileName)}.svg`);
}

module.exports = async function checkComponents(entry) {
  const componentListMap = {
    wxmlFileList: [],
    wxssFileList: [],
    lessFileList: [],
    jsonFileList: [],
    jsFileList: [],
    tsFileList: [],
    assetsList: [],

    jsFileMap: {}
  };

  const isExists = await _.checkFileExists(entry);
  if (!isExists) {
    const { dirPath, fileName, fileBase } = getPathInfo(entry, '.json');

    componentListMap.jsFileList.push(`${fileBase}.js`);
    componentListMap.jsFileMap[fileBase] = `${path.join(dirPath, fileName)}.js`;

    return componentListMap;
  }

  await checkIncludedComponents(entry, componentListMap);

  return componentListMap;
};
