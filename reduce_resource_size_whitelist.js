/**
 * Created by liangrui on 9/2/16.
 */

var fs = require('fs');

var manifestPath = process.argv[2];
var whitelistPath = './reduce_resource_size_whitelist.txt';

if (!manifestPath) {
    console.log('');
    return;
}
// console.log(whitelistPath);

var manifestJSON = require(manifestPath);
var ignoreResList = fs.readFileSync(whitelistPath).toString().split("\n");
var ignoreResMap = {};
for (var i = 0; i < ignoreResList.length; i++) {
    ignoreResMap[ignoreResList[i]] = 1;
}
// console.log('ignoreResMap:', ignoreResMap);

var ignorePathList = [];

for (var key in manifestJSON) {
    var ext = key.substring(key.lastIndexOf(".") + 1);
    var value = manifestJSON[key];
    var filePath = 'resource/'
        + value["v"].substring(0, 2) + "/"
        + value["v"] + "_" + value["s"] + "." + ext;
    // console.log(key, ' --> ', filePath);

    // 是否应该被忽略
    var shouldIgnore = false;
    if (ignoreResMap[key] == 1) {
        shouldIgnore = true;
        ignorePathList.push(filePath);
    }
}

var output = '';
for (var i = 0; i < ignorePathList.length; i++) {
    output += ignorePathList[i] + (i == ignorePathList.length - 1 ? '' : '\n');
}
console.log(output);