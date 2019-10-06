/**
 * Created by xingyunzhi on 17/1/17.
 */


var _ = require('underscore');

var util = require('./util/util');
var configUtil = require('./util/configUtil');

var slotsgameunit = require('./config/slotsgameunit.json');
var gamecontent = require('./config/slotsgamecontent.json');
var wildUnit = gamecontent[0].wildunit;

function getRowArr() {
    var rows1=[],rows2=[],rows3=[],rows4=[],rows5=[];

    for(var i = 0;i < slotsgameunit.length;i++){
        rows1.push(slotsgameunit[i].row1);
        rows2.push(slotsgameunit[i].row2);
        rows3.push(slotsgameunit[i].row3);
        rows4.push(slotsgameunit[i].row4);
        rows5.push(slotsgameunit[i].row5);
    }
    return [rows1,rows2,rows3,rows4,rows5];
}


function getRewardLine(line){
    var rowsArr = getRowArr();
    var elementLength = rowsArr[0].length;

    var arr = [];
    var index;
    for(var i = 0;i < 5; i++){
        index = parseInt(Math.random() * elementLength);

        if(index == 0){
            arr[i] = [rowsArr[i][elementLength-1],rowsArr[i][index],rowsArr[i][1]];
        }else if(index == elementLength-1){
            arr[i] = [rowsArr[i][index-1],rowsArr[i][index],rowsArr[i][0]];
        }else{
            arr[i] = [rowsArr[i][index-1],rowsArr[i][index],rowsArr[i][index+1]];
        }

        // console.log('row'+i+' index>>>>'+index+' element>',arr[i]);
    }


    var array = arr;
    var award = [];

    for(var j = 0 ; j < 3 ; j ++){
        var temp = [];
        for(var i = 0 ; i < array.length; i++){
            temp.push(array[i][j])
        }
        award.push(temp);
    }
    award.push([array[0][0],array[1][1],array[2][2],array[3][1],array[4][0]]);
    award.push([array[0][2],array[1][1],array[2][0],array[3][1],array[4][2]]);

    // console.log('award>>>>>>>>>>',award);
    var result = [];

    switch (line){
        case 1:
            result = [award[1]];
            break;
        case 3:
            result = [award[0],award[1],award[2]];
            break;
        case 5:
            result = award;
            break;
    }
    // console.log('result:==',result);
    return result;
}

var configArr = require('./config/slotsgamelinereward');

var slotsgamepotcontrol = require('./config/slotsgamepotcontrol.json');



function getReward(line,cost) {
    var oneReward = 0;

    var lineArr = getRewardLine(line);
    var copyLineArr = JSON.parse(JSON.stringify(lineArr));

    var defArr = [wildUnit,wildUnit,wildUnit,wildUnit,wildUnit];

    for(var i = 0;i<copyLineArr.length;i++){
        var length = _.difference(copyLineArr[i],defArr).length;
        if(!length){
            copyLineArr[i] = ['unit001','unit001','unit001','unit001','unit001'];
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
            var maxNum = gamecontent[0][copyLineArr[i][0]];
            for(var n = 0;n<5;n++){
                if(copyLineArr[i][n] != configArrs[j][n]){
                    if(configArrs[j][n] == copyLineArr[i][0]){
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
                oneReward += parseInt(configArr[j].multi * cost);

                break;
            }
        }
    }
    return  oneReward;
}



function getList(line,cost,times) {
    var rewardObj = {};
    var oneReward = 0;
    for(var i = 1;i<=times;i++){
        oneReward = getReward(line,cost);

        rewardObj[oneReward] = rewardObj[oneReward] + 1 || 1;
    }
    console.log('rewardObj',rewardObj);
    var rewardArr = _.keys(rewardObj).reverse();
    console.log('rewardArr',rewardArr);
    var array = [];
    for(var i = 0;i<50;i++){
        if(i+1>rewardArr.length){
            break;
        }
        array.push({id:rewardArr[i],times:rewardObj[rewardArr[i]]})
    }
    console.log(array,array.length);
}
getList(5,50,50000000);