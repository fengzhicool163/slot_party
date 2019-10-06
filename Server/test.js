var _ = require('underscore');
// var util = require('./util/util');
// var configUtil = require('./util/configUtil');

var gamecontent = require('./config/slotsgamecontent.json')[0];
var wildUnit = 'unit008';

var VERTICAL_ROWS = []; //纵向row
var UNIT_LINE_POS = []; //

var slotsgameline = require('./config/slotsgameline.json');
var slotsgameunits = require('./config/slotsgameunit.json');

function getRowArr() {
    if(VERTICAL_ROWS.length){
        return VERTICAL_ROWS;
    }
    var rows1=[],rows2=[],rows3=[],rows4=[],rows5=[];
    //todo 替换 1
    var slotsgameunit = _.where(slotsgameunits,{table:2});

    for(var i = 0;i < slotsgameunit.length;i++){
        rows1.push(slotsgameunit[i].row1);
        rows2.push(slotsgameunit[i].row2);
        rows3.push(slotsgameunit[i].row3);
        rows4.push(slotsgameunit[i].row4);
        rows5.push(slotsgameunit[i].row5);
    }

    VERTICAL_ROWS = [rows1,rows2,rows3,rows4,rows5];
    return VERTICAL_ROWS;
}

function getUnitLinePos(){
    if(UNIT_LINE_POS.length){
        return UNIT_LINE_POS;
    }

    for(var i = 0 ; i < slotsgameline.length; i++){
        var indexs = _.values(slotsgameline[i]).splice(1);

        for(var j = 0 ; j < indexs.length; j++){
            indexs[j] = indexs[j] - 1;
        }

        UNIT_LINE_POS.push(indexs);
    }

    return UNIT_LINE_POS;
}



function getAwardLineArrayByLine(line, array){
    var award = [];

    var lineArray = getUnitLinePos();

    for(var n = 0 ; n < lineArray.length ; n ++){
        var temp = [];
        var lines = lineArray[n];

        for(var i = 0 ; i < lines.length; i++){
            temp.push(array[i][lines[i]]);
        }
        award.push(temp);
    }
    // console.log('award.length: ', award.length);

    var result = [];

    switch (line){
        case 1:
            result = [award[0]];
            break;
        case 5:
            result = [award[0],award[1],award[2],award[3],award[4]];
            break;
        case 9:
            result = award;
            break;
    }

    return result;
}

function getRewardRowByLine(line){
    var rowsArr = getRowArr();
    var elementLength = rowsArr[0].length;
    // console.log('getRewardRowByLine-------',elementLength);
    var arr = [];
    var rowIndex = [];
    var index;
    for(var i = 0;i < 5; i++){
        //每一列对应的index
        index = parseInt(Math.random() * elementLength);//0-59
        rowIndex.push(index);
        if(index == 0){
            arr[i] = [rowsArr[i][elementLength-1],rowsArr[i][index],rowsArr[i][1]];
        }else if(index == elementLength-1){
            arr[i] = [rowsArr[i][index-1],rowsArr[i][index],rowsArr[i][0]];
        }else{
            arr[i] = [rowsArr[i][index-1],rowsArr[i][index],rowsArr[i][index+1]];
        }
    }

    var awardLine = getAwardLineArrayByLine(line,arr);
    // console.log({rowIndex : rowIndex, awardLine : awardLine});
    return {rowIndex : rowIndex, awardLine : awardLine};
}

var result = {};
result.totalCost = 0;
result.totalReward = 0;
result.eachCost = {};
result.eachReward = {};
result.allRewardLevel = {};

var configArrs1 = require('./config/slotsgamelinereward');
//todo 2替换
var configArr = _.where(configArrs1,{table:2});

var wildArr2 = ['unit001','unit001','unit001','unit001','unit001'];
var wildArr1 = ['unit002','unit002','unit002','unit002','unit002'];
//todo 3替换
var wildArr = wildArr2;

function getReward(line,cost) {
    result.totalCost += line * cost;
    result.eachCost[line+'X'+cost] = result.eachCost[line+'X'+cost] || 0;
    result.eachCost[line+'X'+cost] += parseInt(line * cost);

    var lineArr = getRewardRowByLine(line).awardLine;
    // console.log('lineArr------',lineArr);
    var copyLineArr = JSON.parse(JSON.stringify(lineArr));

    var defArr = [wildUnit,wildUnit,wildUnit,wildUnit,wildUnit];

    for(var i = 0;i<copyLineArr.length;i++){
        var length = _.difference(copyLineArr[i],defArr).length;
        if(!length){
            copyLineArr[i] = wildArr;
        }else{
            for(var j = 0;j<copyLineArr[i].length;j++){
                if(copyLineArr[i][j] != wildUnit){
                    var temp = copyLineArr[i][j];
                    for(var n = 0;n<copyLineArr[i].length;n++){
                        if(copyLineArr[i][n] == wildUnit){
                            copyLineArr[i][n] = temp;
                        }
                    }
                    break;
                }
            }
        }
    }


    var configArrs = [];
    //奖励数组
    configArr.forEach(function (item,index) {
        configArrs[index] = [];
        configArrs[index].push(item.row1);
        configArrs[index].push(item.row2);
        configArrs[index].push(item.row3);
        configArrs[index].push(item.row4);
        configArrs[index].push(item.row5);
    });

    for(var i = 0;i < copyLineArr.length; i++){

        for(var j = 0;j < configArrs.length; j++){
            var numOfSameElement = 0;

            var unitArrs1 = ['unit001','unit002','unit003','unit007'];
            var unitArrs2 = ['unit004','unit005','unit006'];

            var maxNum;
            var temp = copyLineArr[i][0];

            if(unitArrs1.indexOf(temp) != -1 ){
                maxNum = gamecontent[temp];
            }

            if(unitArrs2.indexOf(temp) != -1){
                //todo 4替换
                maxNum = gamecontent['table2'+temp];
            }
            for(var n = 0;n<5;n++){
                if(copyLineArr[i][n] != configArrs[j][n]){
                    if(configArrs[j][n] == temp){
                        numOfSameElement = 0;
                        break;
                    }else{
                        break;
                    }
                }else{
                    numOfSameElement ++;
                }
            }
            if(numOfSameElement >= maxNum){
                //直接获取
                result.totalReward += configArr[j].value * cost;
                result.eachReward[line+'X'+cost] = result.eachReward[line+'X'+cost] || 0;
                result.eachReward[line+'X'+cost] += configArr[j].value * cost;
                result.allRewardLevel[configArr[j].rewardLevel] = result.allRewardLevel[configArr[j].rewardLevel] || 0;
                result.allRewardLevel[configArr[j].rewardLevel] += 1;
                break;
            }
        }
    }
}

var slotlinebet = require('./config/slotlinebet.json');

var slotlinerate = require('./config/slotlinerate.json');
var timesArr = [];
for(var i = 0;i<slotlinerate.length;i++){
    timesArr.push(slotlinerate[i]['rate1'] * 1000000);
}

function getAll() {
    for(var i = 0;i< timesArr.length;i++){
        var line = slotlinebet[i].line;
        var cost = slotlinebet[i].bat;

        for(var j = 0;j<timesArr[i];j++){
            getReward(line,cost);
        }
    }
    // console.log('configArr.length==',configArr.length);
    for(var i = 1;i <= configArr.length;i++){
        result.allRewardLevel[i] = result.allRewardLevel[i] || 0;
    }

    var resultArr = [];
    for(var key in result){
        if(typeof result[key] == 'number'){
            resultArr.push(result[key]);
            resultArr.push(' ');
        }else{
            for(var keys in result[key]){
                resultArr.push(result[key][keys]);
            }
            resultArr.push(' ');
        }
    }
    console.log(resultArr);
}

getAll();


