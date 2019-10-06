/**
 * Created by liangrui on 28/10/2016.
 */

var fs = require('fs');
var path = require('path');
var parser = require('xml2json');
var xlsx = require('xlsx');
var nodeExcel = require('excel-export');

function exportEnUS() {
    var jsonTranslate = require('./translate.en.json');
    var all = [];

    for (var key in jsonTranslate) {
        var value = jsonTranslate[key];
        if (!!value['zh_CN'] && !!value['zh_CN'].trim()) {
            all.push({k:value['zh_CN'], v:value['en_US']});
        }
    }

    function sortByKey(a, b) {
        var ak = a.k;
        var bk = b.k;
        return ((ak < bk) ? -1 : ((ak > bk) ? 1 : 0));
    }
    all.sort(sortByKey);

    var columns = ['zh_CN', 'en_US', 'tag'];

    var conf ={};
    conf.name = "translate.en_US";
    conf.cols = [];
    var row = [];
    for (var i = 0; i < columns.length; i++) {
        conf.cols.push({caption:columns[i], type:'string'});
        row.push(columns[i]);
    }
    conf.rows = [row];

    var allLines = all;
    for (var i = 0, len = allLines.length; i < len; i++) {
        var line = allLines[i];
        var content = [];
        content.push(line['k']);
        content.push(line['v']);
        content.push('');

        conf.rows.push(content);
    }

    var result = nodeExcel.execute(conf);
    var excel_file = path.resolve(__dirname, "translate.en_US.xlsx");
    fs.writeFileSync(excel_file, result, 'binary');
    console.log('excel --> ', excel_file);
}

function exportAllOthers() {
    var jsonTranslate = require('./translate.complete.json');
    var all = [];

    for (var key in jsonTranslate) {
        var value = jsonTranslate[key];
        if (!!value['zh_CN']) {
            all.push({k:value['zh_CN'], 'zh_TW':value['zh_TW'], 'zh_CN_1':value['zh_CN_1']});
        }
    }

    function sortByKey(a, b) {
        var ak = a.k;
        var bk = b.k;
        return ((ak < bk) ? -1 : ((ak > bk) ? 1 : 0));
    }
    all.sort(sortByKey);

    var names = ['zh_TW', 'zh_CN_1'];
    for (var n = 0; n < names.length; n++) {
        var nn = names[n];

        var columns = ['zh_CN', nn, 'tag'];

        var conf ={};
        conf.name = "translate." + nn;
        conf.cols = [];
        var row = [];
        for (var i = 0; i < columns.length; i++) {
            conf.cols.push({caption:columns[i], type:'string'});
            row.push(columns[i]);
        }
        conf.rows = [row];

        var allLines = all;
        for (var i = 0, len = allLines.length; i < len; i++) {
            var line = allLines[i];
            var content = [];
            content.push(line['k']);
            content.push(line[nn]);
            content.push('');

            conf.rows.push(content);
        }

        var result = nodeExcel.execute(conf);
        var excel_file = path.resolve(__dirname, "translate." + nn + ".xlsx");
        fs.writeFileSync(excel_file, result, 'binary');
        console.log('excel --> ', excel_file);
    }
}

//exportEnUS();
//exportAllOthers();
