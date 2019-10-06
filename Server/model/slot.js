/**
 * Created by xingyunzhi on 16/12/25.
 */
var _ = require('underscore');
var util = require('../util/util');
var configUtil = require('../util/configUtil');
var gamecontent = configUtil.getConfigByName('slotsgamecontent')[0];
var slotsgamelinereward = configUtil.getConfigByName('slotsgamelinereward');
var slotsgameline = configUtil.getConfigByName('slotsgameline');

var virtualRows = {}; //纵向row 5列
var HORIZONTAL_ROWS = {}; //横向row 9行
var UNIT_LINE_POS = []; //9行的位置

function getRowArr(numOfGetReward) {
    var table = (numOfGetReward == 4 ?  2 : 1);
    if(virtualRows[table] && virtualRows[table].length){
        return virtualRows[table];
    }

    var rows1=[],rows2=[],rows3=[],rows4=[],rows5=[];
    var slotsgameunit;

    if(numOfGetReward == 4){//S界面
        slotsgameunit = configUtil.getObjsByOpt('slotsgameunit',{table:2});
    }else{//R界面
        slotsgameunit = configUtil.getObjsByOpt('slotsgameunit',{table:1});
    }
    for(var i = 0;i < slotsgameunit.length;i++){
        rows1.push(slotsgameunit[i].row1);
        rows2.push(slotsgameunit[i].row2);
        rows3.push(slotsgameunit[i].row3);
        rows4.push(slotsgameunit[i].row4);
        rows5.push(slotsgameunit[i].row5);
    }

    virtualRows[table] = [rows1,rows2,rows3,rows4,rows5];
    return virtualRows[table];
}


function getHorizontalRow(numOfGetReward) {
    var table = (numOfGetReward == 4 ?  2 : 1);
    if(HORIZONTAL_ROWS[table] && HORIZONTAL_ROWS[table].length){
        return HORIZONTAL_ROWS[table];
    }

    HORIZONTAL_ROWS[table] = [];
    //奖励数组
    slotsgamelinereward.forEach(function (item,index) {
        HORIZONTAL_ROWS[table][index] = [];
        HORIZONTAL_ROWS[table][index].push(item.row1);
        HORIZONTAL_ROWS[table][index].push(item.row2);
        HORIZONTAL_ROWS[table][index].push(item.row3);
        HORIZONTAL_ROWS[table][index].push(item.row4);
        HORIZONTAL_ROWS[table][index].push(item.row5);
    });
    return HORIZONTAL_ROWS[table];
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

//根据line 返回几条线
function getRewardRowByLine(line,numOfGetReward){
    var rowsArr = getRowArr(numOfGetReward);
    var elementLength = rowsArr[0].length;
    console.log('getRewardRowByLine-------',elementLength);
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
    return {rowIndex : rowIndex, awardLine : awardLine};
}



//根据line 和已知道的第一条线  返回几条线
/**
 *
 * @param line
 * @param result 中间的line
 * @param numOfGetReward
 * @returns {{rowIndex: Array, awardLine}}
 */
function getRewardRowByLine1(line,result,numOfGetReward){
    var rowsArr = getRowArr(numOfGetReward);
    var elementLength = rowsArr[0].length;
    console.log('getRewardRowByLine1--------------',elementLength);


    var arr = [];
    var rowIndex = result.split(',');

    for(var i = 0;i < rowIndex.length; i++){
        var index = parseInt(rowIndex[i]);

        if(index == 0){
            arr[i] = [rowsArr[i][elementLength-1],rowsArr[i][index],rowsArr[i][1]];
        }else if(index == elementLength-1){
            arr[i] = [rowsArr[i][index-1],rowsArr[i][index],rowsArr[i][0]];
        }else{
            arr[i] = [rowsArr[i][index-1],rowsArr[i][index],rowsArr[i][index+1]];
        }
    }
    var awardLine = getAwardLineArrayByLine(line,arr);
    return {rowIndex : rowIndex, awardLine : awardLine};
}


//由选择的线条数和花费    line  cost
//得到 奖励数量, 旋转位置数组(5个), 中奖线数组(中了几条返回几个,每个包含: 线的序号, 串联的个数)

function getReward(opt) {
    var line = opt.line,cost = opt.costDiamond, resultLine = !!opt.resultOfLine && opt.resultOfLine.line ? opt.resultOfLine.line: null;
    var numOfGetReward = opt.numOfGetReward;
    var beautyArr = ['unit009','unit010','unit011','unit012'];
    console.log('numOfGetReward---------????',numOfGetReward);

    var rewardRow = [];
    if(!!resultLine){
        rewardRow = getRewardRowByLine1(line,resultLine,numOfGetReward);
    }else{
        rewardRow = getRewardRowByLine(line,numOfGetReward);
    }

    var lineArr = rewardRow.awardLine;

    var rowIndex = rewardRow.rowIndex;

    var copyLineArr = JSON.parse(JSON.stringify(lineArr));
    var wildUnit = gamecontent.wildunit || 'unit008'; //万能元素
    var special = [wildUnit,wildUnit,wildUnit,wildUnit,wildUnit];
    for(var i = 0; i < copyLineArr.length; i++){
        var temp = copyLineArr[i];

        var length = _.difference(temp,special).length;
        if(!length){
            if(numOfGetReward < 4){
                //R界面
                copyLineArr[i] = ['unit002','unit002','unit002','unit002','unit002'];
            }else if(numOfGetReward == 4){
                //S界面
                copyLineArr[i] = ['unit001','unit001','unit001','unit001','unit001'];
            }
        }else{
            for(var j = 0;j < temp.length; j++){
                if(temp[j] != wildUnit){
                    var temp1 = temp[j];
                    for(var n = 0;n < temp.length; n++){
                        if(temp[n] == wildUnit){
                            temp[n] = temp1;
                        }
                    }
                    break;
                }
            }
        }
    }
    var horizontalRows = getHorizontalRow(numOfGetReward);

    var result = {
        rewardDiamond : 0,
        rowArray : {},
        rewardTypeDetails   :   {},
        rewardDetails : {},
        rowIndex    :   rowIndex,
        task:   {tree1:parseInt(line*cost), tree2:0, tree3:gamecontent.gameId},
        rewardLevel:{},
        rewardType: {},
        rewardTypeReward:{},
        collectBeautys :   {'unit009':0,'unit010':0,'unit011':0,'unit012':0}
    };

    if(numOfGetReward < 4){
        var multi;
        if(cost == 10){
            multi = gamecontent.bet1multi;
        }else if(cost == 20){
            multi = gamecontent.bet2multi;
        }else if(cost == 50){
            multi = gamecontent.bet3multi;
        }

        for(var i = 0;i < lineArr.length; i++){
            for(var j = 0;j<lineArr[i].length;j++){
                for(var n = 0;n<beautyArr.length;n++){
                    if(lineArr[i][j] == beautyArr[n]){
                        result.collectBeautys[beautyArr[n]] ++;
                    }
                }
            }
        }
        result.collectBeautys = _.mapObject(result.collectBeautys,function (val,key) {
            return Math.ceil(val * multi);
        });
    }




    var unitArrs1 = ['unit001','unit002','unit003','unit007'];
    var unitArrs2 = ['unit004','unit005','unit006'];
    for(var i = 0;i < copyLineArr.length; i++){
        var currCopyLine = copyLineArr[i];
        var firstUnit = currCopyLine[0];

        //对比奖项列 中奖的unit pos
        for(var j = 0;j < horizontalRows.length; j++){
            var currHorizontalRow = horizontalRows[j];
            var numOfSameElement = 0;

            var maxNum;
            if(unitArrs1.indexOf(firstUnit) != -1 ){
                maxNum = gamecontent[firstUnit];
            }
            if(unitArrs2.indexOf(firstUnit) != -1){
                if(numOfGetReward < 4){
                    maxNum = gamecontent['table1'+firstUnit];
                }else if(numOfGetReward == 4){
                    maxNum = gamecontent['table2'+firstUnit];
                }
            }

            for(var n = 0; n < 5;n++){
                if(currCopyLine[n] != currHorizontalRow[n]){
                    if(currHorizontalRow[n] == firstUnit){
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
                var currLineReward = slotsgamelinereward[j];
                console.log('currLineReward: ', currLineReward);

                result.rewardLevel[currLineReward.rewardLevel]  = result.rewardLevel[currLineReward.rewardLevel] || 0;
                result.rewardLevel[currLineReward.rewardLevel] ++;

                result.rewardType[currLineReward.rewardtype] = i+1;
                result.rewardTypeReward[currLineReward.rewardtype] = result.rewardTypeReward[currLineReward.rewardtype] || 0;

                if(currLineReward.rewardtype == 1){
                    if(currLineReward.value > result.task.tree2){
                        result.task.tree2 = currLineReward.value;
                    }
                    result.rewardDiamond += parseInt(currLineReward.value * cost);
                    result.rewardTypeReward[currLineReward.rewardtype] += parseInt(currLineReward.value * cost);
                    result.rewardDetails[i + 1] = parseInt(currLineReward.value * cost);
                }
                result.rewardTypeDetails[i+1] = currLineReward.rewardtype;
                result.rowArray[i + 1] = numOfSameElement;

                break;
            }
        }
    }

    result.line = lineArr;
    console.log('getReward---reuslt---------?????',result);
    return result;
}

/**
 *
 * @param line ： 1 5 9
 * @param costDiamond
 * @param jackPotDiamond 抽奖池总U钻
 * @param free 是否是免费摇奖
 */
function getRewardFromPool(opt) {
    if (opt.jackPotDiamond < 0) {
        opt.jackPotDiamond = 0;
    }

    var result = getReward(opt);
    while(opt.free && result.rewardDiamond > gamecontent.maxfreereward ){
        result = getReward(opt);
        console.log('opt.free----------');
    }
    if(result.rewardTypeReward["1"]){
        var times = 1;

        while(result.rewardTypeReward["1"] > opt.jackPotDiamond ){
            times++;
            result = getReward(opt);
        }
        if(result.rewardType['2']){
            var type2Reward = parseInt((opt.jackPotDiamond - result.rewardTypeReward['1'])*result.rewardTypeReward['2']);
            result.rewardDetails[result.rewardType['2']] = type2Reward;
            result.rewardDiamond = result.rewardTypeReward['1'] + type2Reward;
        }

        if(times >= 10){
            var nodemailer = require('./nodemailer');
            nodemailer.sendMail(util.gameConfig.server_name + '-slot-from-pool-times-alarm', JSON.stringify({times : times, result: result}, null, 2));
        }
        console.log('getRewardFromPool---reuslt---------?????',result,result.rewardTypeReward['2']);
    }



    return result;
}

exports.getRewardFromPool = getRewardFromPool;
