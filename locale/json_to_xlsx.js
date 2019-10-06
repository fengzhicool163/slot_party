/**
 * Created by huangqingfeng on 16/7/20.
 */
var fs = require('fs');
var path = require('path');
var parser = require('xml2json');
var xlsx = require('xlsx');
var nodeExcel = require('excel-export');
var xlsxToJSON = require('./lib/xlsx-to-json.js');
var async = require('async');

var only_locale_name = process.argv[2] || '';

var fgui_path = path.resolve(__dirname, 'fgui/fgui.xml');
var fgui_chinese = [];
 var config_path = path.resolve(__dirname, '../Client/UpGame/resource/config/game_config.json');
 var config_chinese = [];
var codes_path = path.resolve(__dirname, '../Client/UpGame/src/');
var codes_chinese = [];
// var robots_path = path.resolve(__dirname, '../Server/robots.json');
// var robots_chinese = [];
// var robotsName_path = path.resolve(__dirname, '../Server/robotsName.json');
// var robotsName_chinese = [];

console.log('[locale] ----start');
// fgui的xml转成json
var fgui_json;
var xml = fs.readFileSync(fgui_path, 'utf8');
fgui_json = parser.toJson(xml, {
    object: false,
    reversible: false,
    coerce: true,
    sanitize: true,
    trim: true,
    arrayNotation: false
});
fgui_json = JSON.parse(fgui_json);
var strings = fgui_json.resources.string;
// console.log(strings);
for (var i = 0; i < strings.length; i ++) {
    fgui_chinese.push({k: strings[i]['name'], v: strings[i]['$t']});
}
// console.log(fgui_chinese.length);
// fgui_chinese = unique(fgui_chinese, 'v');
// console.log(fgui_chinese.length);
// console.log(fgui_chinese);
console.log('[locale] parse fgui locale end: ', fgui_chinese.length);

// 配置文件中的中文
 var config = fs.readFileSync(config_path, 'utf-8');
// // 中文正则,这个正在在一般的匹配里是有漏洞的,但是匹配配置文件没什么问题
 var chineseRegExp = /"([^"]*[\u4E00-\u9FA5\uF900-\uFA2D]+.*)"/g;
// // console.log('support special:', chineseRegExp.exec('{"key": "mine_text","value": "1. 玩家每天可以通过消耗进攻次数去对矿区进行进攻\r\n2. 如果矿区没有被玩家占领，玩家需要打败一队防守的怪物来占领矿区\r\n3. 如果矿区被玩家占领，玩家需要打败一队玩家的军队，同时也可以获得一部分玩家当前积累的矿区资源\r\n4. 每个玩家最多占领一个矿区，占领之后进攻其他矿区，若胜利则会立即结算和放弃自己当前的矿区\r\n5. 矿区被玩家占领之后会有10分钟保护时间\r\n6. 矿区的收益随时间增长，在矿区发生结算的时候发放给玩家\r\n7. 矿区的最大占领时间为4小时，4小时之后将自动离开矿区并结算，同时矿区重新被怪物军队占领\r\n8. 玩家也可以提前离开自己的矿区并且获得当前积累的全部收益\r\n9. VIP玩家每天的进攻矿区次数以及可购买的进攻次数会更多\r\n10. 每周日24点会对当周矿区相关排行榜的上榜玩家进行发奖 "},'));
while (true) {
    var c = chineseRegExp.exec(config);
    if (!c) break;

    config_chinese.push({k: c[1], v: c[1]});
}
// // console.log(config_chinese.length);
// // config_chinese = unique(config_chinese, 'v');
// // console.log(config_chinese.length);
// // console.log(config_chinese);
// console.log('[locale] parse config locale end: ', config_chinese.length);

// 机器人的名字
// var robots_config = fs.readFileSync(robots_path, 'utf-8');
// var robots = JSON.parse(robots_config);
// if (robots && robots.length > 0) {
//     for (var i = 0; i < robots.length; i ++) {
//         robots_chinese.push({k: robots[i].nickName, v: robots[i].nickName});
//     }
// }
// console.log('[locale] parse robot locale end: ', robots_chinese.length);

// 跨服PVP机器人的名字
// var robotsName_config = fs.readFileSync(robotsName_path, 'utf-8');
// var robotsName = JSON.parse(robotsName_config);
// if (robotsName && robotsName.length > 0) {
//     for (var i = 0; i < robotsName.length; i ++) {
//         robotsName_chinese.push({k: robotsName[i], v: robotsName[i]});
//     }
// }
// console.log('[locale] parse robotsName locale end: ', robotsName_chinese.length, robotsName_chinese[0]);

//代码中的中文,这个也是有漏洞的,需要去代码里补救
var codesRegExp = /game\.Tools\.lang\(["'](.+?)["'](?:\)|,|\s)/g;
var interval = -1;
eachFile(codes_path, function (err, file) {
    if (file) {
        var r;
        while (true) {
            r = codesRegExp.exec(file.content);
            if (!r) break;

            codes_chinese.push({k: r[1], v: r[1]});
        }

        if (interval)
            clearTimeout(interval);

        interval = setTimeout(function () {
            clearTimeout(interval);
            // console.log(codes_chinese.length);
            // codes_chinese = unique(codes_chinese, 'v');
            console.log('[locale] parse code locale end: ', codes_chinese.length);
            // console.log(codes_chinese.length);
            // console.log(codes_chinese);

            joinAll();
        }, 500);
    }
});

// 整合三部分语言文字到一块儿
function joinAll() {
    var allObj = {};
    var k, v, items;
    for (i = 0; i < config_chinese.length; i ++) {
        k = config_chinese[i]['v'];
        v = config_chinese[i]['k'];
        items = !!allObj[k] ? allObj[k] : [];
        items[0] = {k: k, v: v};
        allObj[k] = items;
    }
    // for (i = 0; i < robots_chinese.length; i ++) {
    //     k = robots_chinese[i]['v'];
    //     v = robots_chinese[i]['k'];
    //     items = !!allObj[k] ? allObj[k] : [];
    //     items[0] = {k: k, v: v};
    //     allObj[k] = items;
    // }
    // for (i = 0; i < robotsName_chinese.length; i ++) {
    //     k = robotsName_chinese[i]['v'];
    //     v = robotsName_chinese[i]['k'];
    //     items = !!allObj[k] ? allObj[k] : [];
    //     items[0] = {k: k, v: v};
    //     allObj[k] = items;
    // }
    for (i = 0; i < codes_chinese.length; i ++) {
        k = codes_chinese[i]['v'];
        v = codes_chinese[i]['k'];
        items = !!allObj[k] ? allObj[k] : [];
        items[0] = {k: k, v: v};
        allObj[k] = items;
    }
    for (var i = 0; i < fgui_chinese.length; i ++) {
        k = fgui_chinese[i]['v'];
        v = fgui_chinese[i]['k'];
        items = !!allObj[k] ? allObj[k] : [];
        items.push({k: v, v: k, fgui: true})
        allObj[k] = items;
        // all.push({k:fgui_chinese[i]['k'], v:fgui_chinese[i]['v'], fgui:true});
    }

    var keys = Object.keys(allObj);
    function sortByValue(a, b) {
        var ak = a.v;
        var bk = b.v;
        return ((ak < bk) ? -1 : ((ak > bk) ? 1 : 0));
    }
    keys.sort(sortByValue);

    var sortedObject = {};
    for (var i = 0; i < keys.length; i ++) {
        sortedObject[keys[i]] = allObj[keys[i]];
    }
    
    // var allObj = {};
    // var k, v, item;
    // var debugCount = 0;
    // for (var i = 0, len = all.length; i < len; i++) {
    //     item = all[i];
    //     k = item['v'];
    //     if (!allObj[k]) {
    //         v = [item];
    //     } else {
    //         v = allObj[k];
    //         if (item.fgui) {
    //             debugCount ++;
    //             if (k == '限时活动') {
    //                 console.log('')
    //             }
    //             v.push(item);
    //         } else {
    //             v[0] = item;
    //         }
    //     }
    //     allObj[k] = v;
    // }
    // console.log('___________', sortedObject['限时活动']);

    generateExcel(sortedObject);
}

function eachFile(dir, cb) {
    fs.readdir(dir, function (err, files) {
        if (!err) {
            var file;
            for (var i = 0; i < files.length; i++) {
                var p = path.resolve(dir, files[i]);
                file = fs.statSync(p);
                if (file.isDirectory()) {
                    eachFile(p, cb);
                } else if (file.isFile() && files[i].indexOf('.ts') != -1) {
                    cb(err, {name: files[i], content: fs.readFileSync(p, 'utf-8')});
                }
            }
        } else {
            cb(err);
        }
    })
}

function unique(arr, key) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (typeof elem === 'object' && !!key)
            elem = elem[key];
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

function generateExcel(newObj) {
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
        var headRow = 2;
        var arraySeparator = ',';
        xlsxToJSON.toJson(src_file, headRow, arraySeparator, function (err, data) {
            console.log('to json, excel:', name, ', err:', err);
            var oldObj = removeCarriageReturn(data);
            if (!!oldObj) {
                var mergeResults = mergeExcel(newObj, oldObj);
                // console.log('last one:', mergeResults[mergeResults.length - 1]);
                var columns = Object.keys(mergeResults[0]);
                // console.log('columns:', columns);

                var excelName = name.split('.xlsx')[0];

                var conf ={};
                conf.name = excelName;
                conf.cols = [];
                var row = [];
                for (var i = 0; i < columns.length; i++) {
                    conf.cols.push({caption:columns[i], type:'string'});
                    row.push(columns[i]);
                }
                conf.rows = [row];

                var allLines = mergeResults;
                for (var i = 0, len = allLines.length; i < len; i++) {
                    var line = allLines[i];
                    var content = [];
                    for (var j = 0; j < row.length; j++) {
                        var col = row[j];
                        content.push(line[col] || '');
                    }
                    conf.rows.push(content);
                }

                var result = nodeExcel.execute(conf);
                var excel_file = path.resolve(__dirname, name);
                fs.writeFileSync(excel_file, result, 'binary');
                console.log('excel --> ', excel_file);
            }
            console.log('');

            next();
        });

    }, function (err) {
        console.log('all complete, err:', err);
    });
}

function removeCarriageReturn(data) {
    if (!!data) {
        var input = {};
        for (var lang in data) {
            input[lang] = {};
            for (var key in data[lang]) {
                var old = key;
                key = key.replace(/\\r/g, '\r').replace(/\r/g, '');
                // if (key != old) {
                    // if (key.indexOf('占矿') == 0) {
                    //     console.log('==================');
                    //     console.log('old key:', JSON.stringify(old));
                    //     console.log('new key:', JSON.stringify(key));
                    //     console.log('old value:', JSON.stringify(data[lang][old]));
                    //     console.log('==================');
                    // }
                // }
                input[lang][key] = data[lang][old];
            }
        }
        return input;
    }
    return data;
}

function mergeExcel(newObj, oldObj) {
    var columns = ['zh_CN'];
    for (var lang in oldObj) {
        columns.push(lang);
    }
    columns.push('tag');
    columns.push('fgui#[]');
    console.log('columns:', columns);

    var textUnchanged = [];
    var textNew = [];

    var count = 0;
    for (var key in newObj) {
        var textZH = newObj[key][0]['v'] || '';
        textZH = (textZH + '').trim();
        if (!textZH) continue;

        // 抽取出来的key有双斜杠,要去掉
        var oldTextZH = textZH;
        textZH = textZH.replace(/\\n/g, '\n').replace(/\\r/g, "\r").replace(/\r/g, '');

        // if (oldTextZH != textZH) {
        //     if (oldTextZH.indexOf('规则说明：') == 0) {
        //         console.log('old key:', JSON.stringify(oldTextZH));
        //         console.log('new key:', JSON.stringify(textZH));
        //     }
        // }

        var row = {};
        var isNew = false;
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            row[col] = '';
            if (col == 'zh_CN') {
                row[col] = textZH;
            } else if (col == 'fgui#[]') {
                var fgui = [];
                for (var j = 0; j < newObj[key].length; j ++) {
                    if (newObj[key][j].fgui) {
                        fgui.push(newObj[key][j].k);
                    }
                }
                row[col] = fgui.join(',');
            } else if (col != 'tag') {
                // if (!showed) {
                //     for (var k in oldObj[col]) {
                //         if (k.indexOf('\r\n') != -1) {
                //             showed  =true;
                //             console.log('old key exist rf:', k);
                //             console.log('old value:', oldObj[col][k]);
                //             break;
                //         }
                //     }
                // }

                var oldValue = oldObj[col] && oldObj[col][textZH];

                // if (oldObj[col] && oldObj[col][oldTextZH]) {
                //     console.log('has old:', true, oldTextZH, oldObj[col][oldTextZH]);
                // }
                
                isNew = !oldValue;
                row[col] = oldValue || '';

                if (isNew) {
                    // if (textZH != oldTextZH) {
                        // console.log('----', JSON.stringify(textZH));
                        // console.log('====', JSON.stringify(oldTextZH));
                        // if (textZH.startsWith('（   123456）')) {
                        // if (textZH.indexOf('123456') != -1) {
                        //     console.log('-------------------');
                        //     console.log('new:', JSON.stringify(textZH));
                        //     console.log('old:', JSON.stringify(oldTextZH));
                        //     console.log('new value:', oldObj[col] && oldObj[col][textZH]);
                        //     console.log('old value:', oldObj[col] && oldObj[col][oldTextZH]);
                        //     for (var key in oldObj[col]) {
                        //         // if (key.startsWith('（   123456）')) {
                        //         if (key.indexOf('123456') != -1) {
                        //             console.log('hard code key:', JSON.stringify(key));
                        //             console.log('hard code value:', oldObj[col][key]);
                        //         }
                        //     }
                        //     console.log('-------------------');
                        // }
                    // }
                    count ++;
                    // console.log('new key:', JSON.stringify(textZH));

                    // if (textZH && textZH.indexOf('32785351') != -1) {
                    //     console.log('111');
                    //     var oldKey = '《方阵英雄》\r\n官方QQ群：327853512';
                    //     console.log('old key:', oldKey, oldKey.length);
                    //     console.log('old val:', oldObj[col][oldKey]);
                    //     console.log('new key:', textZH, textZH.length);
                    //     console.log('new val:', oldValue);
                    //     console.log('is equal:', oldKey == textZH);
                    //     console.log('222');
                    //     // for (var i = 0; i < oldKey.length; i++) {
                    //     //     console.log(oldKey.charAt(i), textZH.charAt(i), i);
                    //     //     console.log(oldKey.charCodeAt(i), textZH.charCodeAt(i), i);
                    //     // }
                    //     // console.log('ffff');
                    //     // var arr = textZH.split('');
                    //     // for (var kk = 0; kk < arr.length; kk++) {
                    //     //     console.log(arr[kk] + '$$' + arr[kk].charCodeAt(0) + '$$');
                    //     // }
                        
                    //     console.log('333');
                    // }
                }

                
                 
            }
        }
        if (isNew) {
            row['tag'] = 'new';
            textNew.push(row);
        } else {
            row['tag'] = '';
            textUnchanged.push(row);
        }
    }

    console.log('newly changed:', count);

    return textUnchanged.concat(textNew);
}