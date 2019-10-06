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
    var slotsgameunit = _.where(slotsgameunits,{table:1});

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
// getRewardRowByLine(5);
var beautyArr = ['unit009','unit010','unit011','unit012'];

function getTimes(cost,line,numOfGirl) {
    var multi;
    if(cost == 10){
        multi = 1;
    }else if(cost == 20){
        multi = 2;
    }else if(cost == 50){
        multi = 3;
    }
    var obj = {'unit009':0,'unit010':0,'unit011':0,'unit012':0};
    var overNum = 0;
    var allRound = 0;
    while (overNum < 4){
        var collectBeautys = {'unit009':0,'unit010':0,'unit011':0,'unit012':0};
        var lineArr = getRewardRowByLine(line).awardLine;
        console.log('lineArr---',lineArr);
        allRound ++;
        for(var i = 0;i < lineArr.length; i++){
            for(var j = 0;j<lineArr[i].length;j++){
                for(var n = 0;n<beautyArr.length;n++){
                    if(lineArr[i][j] == beautyArr[n]){
                        collectBeautys[beautyArr[n]] ++;
                    }
                }
            }
        }
        console.log('collectBeautys--',collectBeautys);

        collectBeautys = _.mapObject(collectBeautys,function (val,key) {
            return Math.ceil(val * multi);
        });
        // console.log('collectBeautys--',collectBeautys);

        for(var key in collectBeautys){
            obj[key] += collectBeautys[key];
            if(obj[key] >= numOfGirl){
                obj[key] = -10000;
                overNum ++;
                console.log('overNum--',overNum);
            }
        }
    }
    console.log('allRound-----',allRound);
}
getTimes(10,9,30);