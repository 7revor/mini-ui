const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const transOpts = {
  "presets": [
    ["@babel/preset-env", {
      "modules": false
    }]
  ],
  "plugins": ["@babel/plugin-transform-runtime"]
}; // babel 编译

if (fs.existsSync('es')) {
  deleteFolderRecursive('es');
}
fs.mkdirSync('es');  // 创建 es 目录
compiler('src');

/**
 * 递归编译
 * @param url
 */
function compiler(url) {
  if (fs.existsSync(url)) {
    let files = fs.readdirSync(url);
    files.forEach(function (file, index) {
      const curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) { // 是文件夹
        fs.mkdirSync(curPath.replace(/^src/, 'es'));
        compiler(curPath);
      } else {  // 是文件
        transform(curPath);
      }
    });
  } else {
    console.log("给定的路径不存在，请给出正确的路径");
  }
}

function transform(url) {
  const target = url.replace(/^src/, 'es');
  if (url.endsWith('.js')) { // js 文件
    const data = fs.readFileSync(url); // 读取文件
    const result = babel.transform(data.toString(), transOpts); // 转译
    fs.writeFileSync(target, result.code);   // 写入 es
  } else {
    fs.copyFile(url, target, err => {
      if (err) throw err;
    });
  }
}

/**
 * 递归删除
 * @param {*} url
 */
function deleteFolderRecursive(url) {
  if (fs.existsSync(url)) {
    let files = fs.readdirSync(url);
    files.forEach(function (file, index) {
      const curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else fs.unlinkSync(curPath);
    });
    fs.rmdirSync(url);
  } else console.log("给定的路径不存在，请给出正确的路径");
}
