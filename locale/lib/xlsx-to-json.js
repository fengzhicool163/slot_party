'use strict'

var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

var arraySeparator;

module.exports = {

    /**
     * export .xlsx file to json
     * src_excel_file: path of .xlsx files.
     * dest_dir: directory for exported json files.
     * head: line number of excell headline.
     * separator : array separator.
     */
    toJson: function(src_excel_file, head, separator, cb) {
        arraySeparator = separator;

        console.log("parsing excel:", src_excel_file);
        var excel = xlsx.parse(src_excel_file);
        _toJson(excel, head, cb);
    }
};

function clone(obj){
    var o;
    switch(typeof obj){
        case 'undefined': break;
        case 'string'   : o = obj + '';break;
        case 'number'   : o = obj - 0;break;
        case 'boolean'  : o = obj;break;
        case 'object'   :
            if(obj === null){
                o = null;
            }else{
                if(obj instanceof Array){
                    o = [];
                    for(var i = 0, len = obj.length; i < len; i++){
                        o.push(clone(obj[i]));
                    }
                }else{
                    o = {};
                    for(var k in obj){
                        o[k] = clone(obj[k]);
                    }
                }
            }
            break;
        default:
            o = obj;break;
    }
    return o;
}


/**
 * export .xlsx file to json formate.
 * excel: json string converted by 'node-xlsx'。
 * head : line number of excell headline.
 * dest : directory for exported json files.
 */
function _toJson(excel, head, cb) {
    console.log('worksheets len:', excel.worksheets.length);
    for (var i_sheet = 0; i_sheet < excel.worksheets.length; i_sheet++) {
        var sheet = excel.worksheets[i_sheet];

        if (sheet.data && sheet.data.length > 0) {

            var row_head = sheet.data[head - 1];

            var col_type = []; //column data type
            var col_name = []; //column name

            //读取表头 解读列名字和列数据类型
            //parse headline to get column name & column data type
            for (var i_cell = 0; i_cell < row_head.length; i_cell++) {
                var name = row_head[i_cell].value;
                if (typeof name == 'undefined' || !name) {
                    break;
                }

                var type = 'basic';

                if ((name+'').indexOf('#') != -1) {
                    var temp = name.split('#');
                    name = temp[0];
                    type = temp[1];
                    if (type) {
                        type = trim(type);
                    }
                }

                col_type.push(type);
                col_name.push(name);
            }

            var output = [];

            for (var i_row = head; i_row < sheet.maxRow; i_row++) {
                var row = sheet.data[i_row];
                if (typeof row == 'undefined' || !row[0]) {
                    break;
                }
                var json_obj = {};

                for (var i_col = 0; i_col < col_type.length; i_col++) {
                    var cell = row[i_col];
                    var type = col_type[i_col].toLowerCase().trim();

                    switch (type) {
                        case 'basic': // number string boolean date
                            if (cell) {
                                if (isDateType(cell.value)) {
                                    parseDateType(json_obj, col_name[i_col], cell.value);
                                } else {
                                    json_obj[col_name[i_col]] = cell.value;
                                }
                            };
                            break;
                        case 'date':
                            parseDateType(json_obj, col_name[i_col], cell.value);
                            break;
                        case 'string':
                            if (cell) {
                                if (isDateType(cell.value)) {
                                    parseDateType(json_obj, col_name[i_col], cell.value);
                                } else {
                                    if (cell.value == null || cell.value.toString() == 'null') {
                                        json_obj[col_name[i_col]] = "";
                                    } else {
                                        json_obj[col_name[i_col]] = cell.value.toString();
                                    }
                                }
                            } else {
                                json_obj[col_name[i_col]] = "";
                            }
                            break;
                        case 'number':
                            //+xxx.toString() '+' means convert it to number
                            var isNumber = !isNaN(+cell.value.toString());
                            if (cell && isNumber) {
                                json_obj[col_name[i_col]] = Number(cell.value);
                            } else {
                                json_obj[col_name[i_col]] = 0;
                            }
                            if (!isNumber) {
                                console.log("cell[" + (i_row + 1) + "," + (i_col + 1) + "]: not a number");
                            }
                            break;
                        case 'bool':
                            if (cell) {
                                json_obj[col_name[i_col]] = toBoolean(cell.value.toString());
                            } else {
                                json_obj[col_name[i_col]] = false;
                            }
                            break;
                        case '{}': //support {number boolean string date} property type
                            if (cell) {
                                parseObject(json_obj, col_name[i_col], cell.value);
                            }
                            break;
                        case '[]': //[number] [boolean] [string]  todo:support [date] type
                            if (cell) {
                                parseBasicArrayField(json_obj, col_name[i_col], cell.value);
                            }
                            break;
                        case '[{}]':
                            if (cell) {
                                parseObjectArrayField(json_obj, col_name[i_col], cell.value);
                            } else {
                                json_obj[col_name[i_col]] = [];
                            }
                            break;
                        default:
                            console.log('********************************************');
                            console.log('unrecognize type', cell.value, typeof(cell.value));
                            break;
                    }
                }
                output.push(json_obj);
            }

            var ignoreColumns = ['zh_CN', 'tag', 'fgui'];
            var languageMap = {};
            for (var i = 0; i < col_name.length; i++) {
                if (ignoreColumns.indexOf(col_name[i]) == -1) {
                    languageMap[col_name[i]] = {};
                }
            }
            console.log('language map:', languageMap, 'excel row:', output.length);

            // 字母序排序
            output.sort(sortByKey);

            for (var i = 0, len = output.length; i < len; i++) {
                var obj = output[i];

                var fgui;
                for (var lang in languageMap) {
                    var langKey = obj['zh_CN'] || '';
                    var langVal = obj[lang] || '';

                    // if (langKey.trim() != langKey) {
                    //     console.log('contains space:', langKey, langVal);
                    // }

                    // if (langKey != langKey.replace(/\\n/g, "\n").replace(/\\r/g, "\r")) {
                    //     console.log('contains csrf:', langKey);
                    // }

                    langKey = langKey.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\r/g, "");
                    langVal = langVal.replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\r/g, "");

                    // if (langKey == '巅峰对决') {
                    //     console.log('-----------', obj);
                    // }

                    languageMap[lang][langKey] = langVal;

                    fgui = obj['fgui'];
                    if (!fgui) continue;
                    for (var k = 0; k < fgui.length; k ++) {
                        if (!!fgui[k]) {
                            var tmpArr = fgui[k].split('-');
                            var tmpObj = languageMap[lang][tmpArr[0]] || {};
                            tmpObj[tmpArr[1]] = langVal || '';
                            languageMap[lang][tmpArr[0]] = tmpObj;
                        }
                    }
                }
            }
            return cb(null, languageMap);
        }
    }
}

function sortByKey(a, b) {
    var ak = a['zh_CN'];
    var bk = b['zh_CN'];
    return ((ak < bk) ? -1 : ((ak > bk) ? 1 : 0));
}

/**
 * parse date type
 * row:row of xlsx
 * key:col of the row
 * value: cell value
 */
function parseDateType(row, key, value) {
    row[key] = convert2Date(value);
}

/**
 * convert string to date type
 * value: cell value
 */
function convert2Date(value) {
    var dateTime = moment(value);
    if (dateTime.isValid()) {
        return dateTime.format("YYYY-MM-DD HH:mm:ss");
    } else {
        return "";
    };
}

/**
 * parse object array.
 */
function parseObjectArrayField(row, key, value) {

    var obj_array = [];

    if (value) {
        if (value.indexOf(',') !== -1) {
            obj_array = value.split(',');
        } else {
            obj_array.push(value.toString());
        }
    }

    // if (typeof(value) === 'string' && value.indexOf(',') !== -1) {
    //     obj_array = value.split(',');
    // } else {
    //     obj_array.push(value.toString());
    // };

    var result = [];

    obj_array.forEach(function(e) {
        if (e) {
            result.push(array2object(e.split(';')));
        }
    });

    row[key] = result;
};

/**
 * parse object from array.
 *  for example : [a:123,b:45] => {'a':123,'b':45}
 */
function array2object(array) {
    var result = {};
    array.forEach(function(e) {
        if (e) {
            var kv = e.trim().split(':');
            if (isNumber(kv[1])) {
                kv[1] = Number(kv[1]);
            } else if (isBoolean(kv[1])) {
                kv[1] = toBoolean(kv[1]);
            } else if (isDateType(kv[1])) {
                kv[1] = convert2Date(kv[1]);
            };
            result[kv[0]] = kv[1];
        };
    });
    return result;
}

/**
 * parse object
 */
function parseObject(field, key, data) {
    if(!!data && typeof data.split == 'function'){
        field[key] = array2object(data.split(';'));
    }
};


/**
 * parse simple array.
 */
function parseBasicArrayField(field, key, array) {
    var basic_array;

    if (typeof array === "string") {
        basic_array = array.split(arraySeparator);
    } else {
        basic_array = [];
        basic_array.push(array);
    };

    var result = [];
    if (isNumberArray(basic_array)) {
        basic_array.forEach(function(element) {
            result.push(Number(element));
        });
    } else if (isBooleanArray(basic_array)) {
        basic_array.forEach(function(element) {
            result.push(toBoolean(element));
        });
    } else { //string array
        result = basic_array;
    };
    // console.log("basic_array", result + "|||" + cell.value);
    field[key] = result;
};

/**
 * convert value to boolean.
 */
function toBoolean(value) {
    return value.toString().toLowerCase() === 'true'
};

/**
 * is a boolean array.
 */
function isBooleanArray(arr) {
    return arr.every(function(element, index, array) {
        return isBoolean(element);
    });
};

/**
 * is a number array.
 */
function isNumberArray(arr) {
    return arr.every(function(element, index, array) {
        return isNumber(element);
    });
};

/**
 * is a number.
 */
function isNumber(value) {

    if (typeof(value) == "undefined") {
        return false;
    }

    if (typeof value === 'number') {
        return true;
    };
    return !isNaN(+value.toString());
};

/**
 * boolean type check.
 */
function isBoolean(value) {

    if (typeof(value) == "undefined") {
        return false;
    }

    if (typeof value === 'boolean') {
        return true;
    };

    var b = value.toString().trim().toLowerCase();

    return b === 'true' || b === 'false';
};

//delete all space
function trim(str) {
    return str.replace(/(^\s+)|(\s+$)/g, "");
}

/**
 * date type check.
 */
function isDateType(value) {
    if (value) {
        var str = value.toString();
        return moment(new Date(value), "YYYY-M-D", true).isValid() || moment(value, "YYYY-M-D H:m:s", true).isValid() || moment(value, "YYYY/M/D H:m:s", true).isValid() || moment(value, "YYYY/M/D", true).isValid();
    }
    return false;
}
