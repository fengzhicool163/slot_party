/**
 * Created by liangrui on 7/26/16.
 */

var xlsx = require('./lib/xlsx-to-json.js');
var path = require('path');
var fs = require('fs');
var async = require('async');

var only_locale_name = process.argv[2] || '';

var excelNames = [];
var files = fs.readdirSync(__dirname);
for (var i = 0; i < files.length; i++) {
    var ext = path.extname(files[i]);
    if (ext == '.xlsx') {
        if (!!only_locale_name) {
            var onlyLocale = 'translate.' + only_locale_name + '.xlsx';
            if (files[i] == onlyLocale) {
                excelNames.push(files[i]);
            }
        } else {
            excelNames.push(files[i]);
        }
    }
}
console.log('');
console.log('excelNames', excelNames);
console.log('');

async.mapSeries(excelNames, function (name, next) {
    var src_file = path.join(__dirname, name);
    var dest_path = path.join(__dirname, '../Client/UpGame/resource/locale/');
    var headRow = 2;
    var arraySeparator = ',';
    xlsx.toJson(src_file, headRow, arraySeparator, function (err, data) {
        console.log('to json, excel:', name, ', err:', err);
        var languageMap = data;
        if (!!languageMap) {
            for (var lang in languageMap) {
                var outputStr = JSON.stringify(languageMap[lang], null, 4);

                // 生成单个语言的json
                var dest_file = dest_path + 'translate.' + lang + '.json';
                fs.writeFileSync(dest_file, outputStr, 'utf-8');
                console.log('exported successfully  -->  ', dest_file);
            }
        }
        console.log('');

        next();
    });

}, function (err) {
    console.log('all complete, err:', err);
});



