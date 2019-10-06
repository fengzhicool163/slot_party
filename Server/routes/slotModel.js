/**
 * 老虎机模块
 * Created by lixiaodong on 16/12/23.
 */

var async = require('async');
var request = require('request');
var _ = require('underscore');
var slot = require('../model/slot');
var configUtil = require('../util/configUtil');
var util = require('../util/util');
var redisKeyUtil = require('../util/redisKeyUtil');
var redisUtil = require('../util/redisUtil');
var errorCode = require('../errorCode');
var rankingModel = require('./rankingModel');
var activityModel = require('../model/activity');
var upModel = require('./upModel');
var noticeModel = require('./noticeModel');
var costLogModel = require('./costLogModel');
var winningRecordModel = require('./winningRecordModel');
var nodemailer = require('../model/nodemailer');

var slotsgamecontent = configUtil.getConfigByName('slotsgamecontent')[0];
var slotsgamecheatprize = configUtil.getConfigByName('slotsgamecheatprize');

var lines = [parseInt(slotsgamecontent.line1),parseInt(slotsgamecontent.line2),parseInt(slotsgamecontent.line3)];
var costArray = [parseInt(slotsgamecontent.bet1),parseInt(slotsgamecontent.bet2),parseInt(slotsgamecontent.bet3)];

var totalCostKey = redisKeyUtil.getKey('TOTAL_COST');
var totalRewardKey = redisKeyUtil.getKey('TOTAL_REWARD');
var rewardLevelKey = redisKeyUtil.getKey('REWARD_LEVEL');
var POT_KEY = redisKeyUtil.getKey('JACK_POT');
/**
 * 获取老虎机的元素
 * @param req
 * @param res
 */
function getSlotElement(req,res) {

    if(activityModel.getActivityEndTime() <= Date.now()){
        return res.send(errorCode.toString(errorCode.ACTIVITY_END))
    }

    if(activityModel.getActivityStartTime() > Date.now()){
        return res.send(errorCode.toString(errorCode.ACTIVITY_NOT_OPEN));
    }

    var uid = req.body.id;
    var bet = parseInt(req.body.diamond);
    var line = parseInt(req.body.line);

    console.log('line : ', line, 'bet: ', bet);
    if(!uid || !bet || !line){
        return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
    }

    if(lines.indexOf(line) == -1 || costArray.indexOf(bet) == -1){
        console.warn(lines,costArray);
        console.error('error: ',lines.indexOf(line), costArray.indexOf(bet));
        return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
    }

    var costDiamond = parseInt(line * bet);

    var userInfo;
    var slotResult;
    var result = {};

    var winning = false;//是否获得大奖

    var costLogObj = {
        uid     :   uid,
        bet     :   bet,
        line    :   line,
        cost    :   costDiamond,
        reward  :   0,
        status  :   0,
        createTime  :   Date.now()
    };
    var userModel = require('./userModel');

    async.waterfall([
        function (cb) {
            userModel.getUser(uid,function (err,data) {
                 if(!err && !!data){
                    userInfo = data;
                 }
                 cb(err);
            });
        },
        function (cb) {
            if (!userInfo) {
                console.error('no_userInfo uid: ', uid);
                return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
            }

            userInfo.resetInfo();

            // 使用免费次数
            if (userInfo.freeTimes > 0) {
                userInfo.freeTimes -= 1;

                costDiamond = 0;
                costLogObj.cost = 0;
                costLogObj.bet = 50;
                costLogObj.line = 9;

                req.body.diamond = costLogObj.bet;
                req.body.line = costLogObj.line;
            }
            cb();
        },
        function (cb) {
            if(userInfo.diamond < costDiamond){
                return res.send({diamond : userInfo.diamond });
            }

            if(costDiamond){
                upModel.buyLuckDrawChance({
                    uid :   uid,
                    diamond:    costDiamond
                }, function (err) {
                    if(!err){
                        userInfo.diamond -= costDiamond;
                    }
                    if(!!err){
                        costLogObj.status = 2;
                    }
                    cb(err);
                });
            } else {
                cb();
            }
        },
        function (cb) {
            var slotParams = {
                uid:    uid,
                diamond: req.body.diamond,
                line: req.body.line,
                isFree: (costDiamond == 0),
                timesOfRewardRate   :   userInfo.timesOfRewardRate,
                rewardRate  :   userInfo.rewardRate,
                numOfGetReward   :   userInfo.numOfGetReward
            };
            var url = util.gameConfig.potHostUrl + 'slotFromJackPot';
            console.log('slotFromJackPot-url: ',url);
            request.post({
                url: url,
                form: slotParams
            }, function (err, resp, body) {
                if (!err && !!body) {
                    slotResult = JSON.parse(body).award;
                }
                if(!slotResult){
                    err = errorCode.INTERNAL_SERVER_ERROR
                }
                if (!!err) {
                    costLogObj.status = 5;
                }
                cb(err);
            });
        },
        function (cb) {
            winning = (slotResult.rewardType && slotResult.rewardType['2'] ? true: false);

            if(slotResult.rewardDiamond){
                costLogObj.status = 1;
                costLogObj.reward = slotResult.rewardDiamond;
            }

            if(slotResult.rewardDiamond > 0){
                var params = {
                    uid: uid,
                    diamond:    slotResult.rewardDiamond
                };
                upModel.sendReward(params, function (err) {
                    if(!err){
                        userInfo.diamond += slotResult.rewardDiamond;
                    }
                    if(!!err){
                        costLogObj.status = 3;
                    }
                    cb(err);
                })
            } else {
                cb();
            }
        },
        function (cb) {
            if(slotResult.rewardDiamond > userInfo.singleMaxReward){
                userInfo.singleMaxReward = slotResult.rewardDiamond;
            }

            rankingModel.updateRanking(userInfo, function (err) {
                cb(err);
            });
        },
        function (cb) {
            var url = util.gameConfig.lobbyHostUrl + 'syncLobbyUserInfo';
            console.log('lobbyUrl: ', url);
            request.post({
                url:    url,
                form:   {
                    id  : uid,
                    username    :   userInfo.username,
                    rewardDiamond   :  slotResult.rewardDiamond,
                    costDiamond :    costDiamond,
                    task    :   slotResult.task,
                    gameId  :   slotsgamecontent.gameId,
                    winning :   winning,
                    isFree:(costDiamond == 0)
                }
            }, function (err,resp,data) {
                if(typeof data == 'string'){
                    data = JSON.parse(data);
                }
                if(!err && !!data){
                    userInfo.taskStatus = data.taskStatus;
                    result.taskStatus = data.taskStatus;
                    result.taskCount = data.taskCount;
                }
                cb(err);
            });
        },
        function (cb) {
            //上帝之手数据
            userInfo.resetInfo();
            userInfo.resetRewardRate();
            userInfo.updateCostAndRewardOfuser(costDiamond,slotResult.rewardDiamond);
            userInfo.getRewardEleOfParty(slotResult);
            userInfo.updateDateOfGodForUser(line,bet);
            userInfo.slotTime = Date.now();
            userInfo.slotTimes ++;
            userInfo.totalSlotTimes ++;
            userInfo.save(function (err) {
                cb(err);
            });
        }
    ],function (err) {
        costLogModel.addCostLogInfo(costLogObj, function () {});
        if(!err){
            result.slotResult = slotResult;
            result.rewardDiamond = slotResult.rewardDiamond;
            result.timesOfRewardRate = userInfo.timesOfRewardRate;
            result.rewardRate = userInfo.rewardRate;
            result.diamond = userInfo.diamond;
            result.totalAwardDiamond = userInfo.awardDiamond;
            result.numOfBeautys = userInfo.numOfBeautys;
            result.numOfEachBeauty = userInfo.numOfEachBeauty;
            result.roundOfS = userInfo.roundOfS;
            result.numOfGetReward = userInfo.numOfGetReward;
            result.haveParty = userInfo.haveParty;
            delete result.slotResult.task;
            delete result.slotResult.line;
            result.freeTimes = userInfo.freeTimes;
            console.log('result->',result);
            return res.send(result);
        } else {
            console.log('slot-error>>>>>>>>>>>>>>>',err);
            return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
        }
    });
}


/** getRewardAndGetNext 获取奖励
*   req id:用户id unitId:完成收集卡牌id
*   res {freeTimes:免费次数 rewardRate奖励倍率  timesOfRewardRate 奖励倍率的次数   }
**/

function getRewardOfParty(req,res) {
    var uid = req.body.id;
    var unitId = req.body.unitId;
    if(!uid){
        return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
    }
    var userModel = require('./userModel');

    var userInfo,result={};
    async.waterfall([
        function (cb) {
            userModel.getUser(uid,function (err,data) {
                if(!err && !!data){
                    userInfo = data;
                }
                cb(err);
            });
        },function (cb) {
            if (!userInfo) {
                return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
            }
            userInfo.resetInfo();
            //todo 如果达到收集数量可领奖
            var unitPointObj = configUtil.getObjByOpt('slotsgameminigame',{unit:unitId});
            var unitPoint = unitPointObj.unitPoint;
            console.log('getRewardOfParty-----unitId------',unitId,unitPoint);

            if(userInfo.numOfEachBeauty[unitId] == unitPoint){
                var rewardId = unitPointObj.rewardId;
                var rewardObjs = configUtil.getObjsByOpt('slotsgamenimigamereward',{rewardId:rewardId});

                var rateArr = _.map(_.pluck(rewardObjs,'rewardRate'),function (num) {
                    return num * 100;
                });

                var index = util.getRandomIndexByWeight(rateArr);

                var rewardObj = rewardObjs[index];
                console.log('获取的奖励－－－',rewardObj);

                if(rewardObj.rewardtype == 1){
                    //获得免费次数
                    userInfo.freeTimes += rewardObj.rewardValue;
                    result.addFreeTimes = rewardObj.rewardValue;
                }else if(rewardObj.rewardtype == 3){
                    //获得倍率
                    var rewardlevel = rewardObj.rewardlevel;
                    var typeValue = '3rewardLevel'+rewardlevel;
                    userInfo.rewardRate = slotsgamecontent[typeValue];
                    userInfo.timesOfRewardRate += rewardObj.rewardValue;
                    result.addTimesOfRewardRate = rewardObj.rewardValue;
                }

                userInfo.numOfGetReward ++;
                if(userInfo.numOfGetReward >= 4){
                    userInfo.haveParty ++;
                }
                userInfo.numOfEachBeauty[unitId] += 1;
            }else{
                return res.send(errorCode.toString(errorCode.NOT_ENOUGH_UNIT));
            }
            userInfo.save(function (err) {
                cb(err);
            });
        },
        function (cb) {
            rankingModel.updateRanking(userInfo, function (err) {
                cb(err);
            });
        }
    ],function (err) {
        result[unitId] = userInfo.numOfEachBeauty[unitId];
        result.haveParty = userInfo.haveParty;
        result.numOfGetReward = userInfo.numOfGetReward;
        result.freeTimes = userInfo.freeTimes;
        result.rewardRate = userInfo.rewardRate;
        result.timesOfRewardRate = userInfo.timesOfRewardRate;
        if(!err){
            return res.send(result);
        }else{
            return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
        }
    });
}


/**
 *
 * @param uid
 * @param line
 * @param bet 下注额
 * @param next
 */
function getDataFromRedis(uid, line, bet, next) {
    console.log('getDataFromRedis: ', uid, line, bet);
    var userInfo;
    var result = {};

    result.totalCost = 0;
    result.totalReward = 0;
    result.rewardLevel = {};
    result.jackPot = 0;
    var resultOfLine = null;
    var userModel = require('./userModel');

    async.waterfall([
        function (cb) {
            userModel.getUser(uid, function (err,data) {
                if(!err && !!data){
                    userInfo = data;
                }
                cb(err);
            });
        },
        function (cb) {
            if(!userInfo){
                return next(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
            }
            userInfo.allRecord = userInfo.allRecord || {};
            userInfo.dayRecord = userInfo.dayRecord || {};
            result.uid = userInfo.uid;

            result.playerData = {
                totalCost   :   userInfo.totalCostDiamond,
                dayCost     :   userInfo.dayCostDiamond,
                totalReward :   userInfo.totalAwardDiamond,
                dayReward   :   userInfo.dayAwardDiamond,
                total520    :   userInfo.allRecord['5*20'] || 0,
                total920    :   userInfo.allRecord['9*20'] || 0,
                day520      :   userInfo.dayRecord['5*20'] || 0,
                day920      :   userInfo.dayRecord['9*20'] || 0
            };
            redisUtil.getRedisData(totalCostKey,function (err,data) {
                if(!err && !!data){
                    result.totalCost = data;
                    cb();
                }else{
                    cb(err);
                }
            });
        },
        function (cb) {
            redisUtil.getRedisData(totalRewardKey,function (err,data) {
                if(!err && !!data){
                    result.totalReward = data;
                    cb();
                }else{
                    cb(err);
                }
            });
        },
        function (cb) {
            redisUtil.redisHGetAll(rewardLevelKey,function (err,data) {
                if(!err && !!data){
                    result.rewardLevel = data;
                    cb();
                }else{
                    cb(err);
                }
            })
        },
        function (cb) {
            redisUtil.getRedisData(POT_KEY,function (err,data) {
                if(!err && !!data){
                    result.jackPot = data;
                    cb();
                } else {
                    cb(err);
                }
            })
        },
        function (cb) {
            resultOfLine = handsOfGod(result, line, bet);

            if(!!resultOfLine && !!resultOfLine.line){
                var rewardLineObj = slotsgamecheatprize[resultOfLine.id];
                var content = {
                    uid :   uid,
                    nickName    :   userInfo.username,
                    getAwardTime    :   Date.now(),
                    rewardLineObj   :   rewardLineObj
                };
                nodemailer.sendAlarmMail(util.gameConfig.server_name+'-HANDS-OF-GOLD-ALARM',JSON.stringify(content));
            }
            cb();
        }
    ],function (err) {
        next(err,resultOfLine);
    })
}

function handsOfGod(data,line,cost) {
    for(var i = 0;i < slotsgamecheatprize.length;i++){
        var isUid = false;

        var user = slotsgamecheatprize[i].user;
        var uidArr = [];

        if(user == "0"){//所有玩家都可中奖
            isUid = true;
        } else {//指定玩家中奖
            uidArr = user.split(",");
            if(uidArr.indexOf(data.uid) != -1){
                isUid = true;
            }
        }
        console.log('isUid: ', isUid, user);
        if(!isUid){
            console.warn('用户不符合中奖条件 跳出此循环');
            continue;
        }

        var isBreak = false;
        for(var j = 1;j <= 3; j++){
            var overAll = slotsgamecheatprize[i]['overall'+j].split(':');
            var value = parseInt(overAll[1]);

            switch (parseInt(overAll[0])){
                case 1:
                    if(parseInt(data.rewardLevel['1']) != value){
                        isBreak = true;
                        console.log('rewardLevel1不满足', data.rewardLevel['1'], value );
                    }
                    break;
                case 2:
                    if(data.rewardLevel['2'] != value){
                        isBreak = true;
                        console.log('rewardLevel2不满足',data.rewardLevel['2'] , parseInt(value));
                    }
                    break;
                case 3:
                    if(data.rewardLevel['3'] != value){
                        isBreak = true;
                        console.log('rewardLevel3不满足',data.rewardLevel['3'] , parseInt(value));
                    }
                    break;
                case 4:
                    var netProfit = data.totalCost - data.totalReward ;
                    if(netProfit < value){
                        isBreak = true;
                        console.log('纯收益不满足',netProfit,parseInt(value));
                    }
                    break;
                case 5:
                    if(data.jackPot < value){
                        isBreak = true;
                        console.log('奖池不满足',data.jackPot , parseInt(value));
                    }
                    break;
            }

            if(isBreak){
                break;
            }
            var casee = slotsgamecheatprize[i]['case'+j].split(':');
            value = parseInt(casee[1]);
            
            switch (parseInt(casee[0])){
                case 1:
                    if(data.playerData.totalCost < value){
                        isBreak = true;
                        console.log('总花费不满足',data.playerData.totalCost , value);
                    }
                    break;
                case 2:
                    if(data.playerData.dayCost < value){
                        isBreak = true;
                        console.log('当日花费不满足');
                    }
                    break;
                case 3:
                    if(data.playerData.totalCost - data.playerData.totalReward < value){
                        isBreak = true;
                        console.log('总花费减总收益不满足');
                    }
                    break;
                case 4:
                    if(data.playerData.dayCost - data.playerData.dayReward < value){
                        isBreak = true;
                        console.log('当日花费减当日收益不满足');
                    }
                    break;
                case 5:
                    if(data.playerData.total520 < value){
                        isBreak = true;
                        console.log('总520次数不满足');
                    }
                    break;
                case 6:
                    if(data.playerData.total920 < value){
                        isBreak = true;
                        console.log('总920次数不满足');
                    }
                    break;
                case 7:
                    if(data.playerData.day520 < value){
                        isBreak = true;
                        console.log('当日520次数不满足');
                    }
                    break;
                case 8:
                    if(data.playerData.day920 < value){
                        isBreak = true;
                        console.log('当日920次数不满足');
                    }
                    break;
                case 9:
                    if(''+line+'*'+cost != '5*20'){
                        console.log('当前不是5*20',''+line+'*'+cost);
                        isBreak = true;
                    }
                    break;
                case 10:
                    if(''+line+'*'+cost != '9*20'){
                        console.log('当前不是9*20',''+line+'*'+cost);
                        isBreak = true;
                    }
                    break;
            }
            if(isBreak){
                break;
            }
        }

        console.log('第'+i+'个条件    isBreak ',isBreak);

        if(isBreak){
            continue;//有条件不符合 跳出 进行下一排条件的判断
        }

        //条件都符合
        var line = slotsgamecheatprize[i].result;
        var  id = slotsgamecheatprize[i].id;
        console.warn('奖励的结果  其中的某一条线 字符串',slotsgamecheatprize[i]);
        return {'line':line,'id':id};
    }
    return null;
}

//同步redis信息  放到jackPotModel
function updateRedisOfHandsOfGod(slotResult,costDiamond,next) {
    async.waterfall([
        function (cb) {
            var rewardLevel = slotResult.rewardLevel;
            var rewardLevelArr = [];
            for(var key in rewardLevel){
                rewardLevelArr.push({'rewardLevel':key,'times':parseInt(rewardLevel[key])})
            }
            async.mapSeries(rewardLevelArr,function (item, call) {
                redisUtil.redisHIncrBy(rewardLevelKey,item.rewardLevel,item.times,function (err) {
                    call(err);
                });
            }, function (err) {
                cb(err);
            });
        },
        function (cb) {
            var rewardDiamond = parseInt(slotResult.rewardDiamond);
            if(rewardDiamond){
                redisUtil.INCRBY(totalRewardKey,rewardDiamond,function (err) {
                    cb(err);
                });
            } else {
                cb();
            }
        },
        function (cb) {
            if(costDiamond){
                redisUtil.INCRBY(totalCostKey,parseInt(costDiamond),function (err) {
                    console.log('error1: ',err);
                    cb(err);
                });
            } else {
                cb();
            }
        }
    ],function (err) {
        next(err);
    })
}



function queryJackPot(req,res) {
    redisUtil.getRedisData(POT_KEY, function (err,data) {
        if(!err){
            return res.send({diamond:   data});
        } else {
            return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
        }
    });
}

module.exports = {
    getSlotElement  :   getSlotElement,
    getDataFromRedis    :   getDataFromRedis,
    queryJackPot    :   queryJackPot,
    updateRedisOfHandsOfGod:    updateRedisOfHandsOfGod,
    getRewardOfParty   :   getRewardOfParty,
}