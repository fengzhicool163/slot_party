/**
 * Created by lixiaodong on 16/12/28.
 */
var async = require('async');
var _ = require('underscore');
var costLogModel = require('./costLogModel');
var util = require('../util/util');
var errorCode = require('../errorCode');
var nodeMailer = require('../model/nodemailer');
var userModel = require('./userModel');
var redisUtil = require('../util/redisUtil');
var redisKeyUtil = require('../util/redisKeyUtil');

var SLOT_PLAYER = redisKeyUtil.getLobbyKey('SLOT_PLAYER');

function statPersonalData(userInfo, next){
    var total = {};
    var costLog = [];
    async.waterfall([
        function (cb) {
            total.totalSlotTimes = userInfo.totalSlotTimes;
            total.totalCostDiamond = userInfo.totalCostDiamond;
            total.totalAwardDiamond = userInfo.totalAwardDiamond;

            costLogModel.queryCostLogInfoByOpt({uid:userInfo.uid},function (err,data) {
                if(!err && !!data){
                    costLog = data;
                }
                cb(err);
            });
        },
        function (cb) {
            if(costLog.length){
                var awardRecord = [];
                var luckyRecord = [];
                var buyDiamondFailedTimes = 0;
                var sendAwardFailedTimes = 0;

                for(var i = 0;i < costLog.length; i++){
                    var record = {};
                    record.createTime = costLog[i].createTime;
                    record.cost = costLog[i].cost;
                    record.reward = costLog[i].reward;
                    if(costLog[i].status == 1){
                        awardRecord.push(record);
                    }

                    if(costLog[i].status == 2){
                        buyDiamondFailedTimes++
                    }

                    if(costLog[i].status == 3){
                        sendAwardFailedTimes++;
                    }

                    if(costLog[i].reward >= 500){
                        luckyRecord.push(record);
                    }
                }

                total.luckyRecord = luckyRecord;
                total.awardRecord = awardRecord;
                total.buyDiamondFailedTimes = buyDiamondFailedTimes;
                total.sendAwardFailedTimes = sendAwardFailedTimes;
            }
            cb();
        }
    ],function (err) {
        next(err,total);
    });
}

/*
//根据uid查
// 1.1  摇奖记录（摇奖时间戳，单次花费、单次收益）
//  1.2 各级中奖次数(rewardLevel, winCount)
//1.3 这个人这辈子的，总次数，总花费、总收益 
*/
function queryRecordById(req,res){
    if (!util.gameConfig.db_util) {
        return res.send({});
    }

    var uid = req.body.id;
    var username = req.body.username;
    var upliveCode = req.body.upliveCode;

    if (!uid && !username && !upliveCode) {
        return res.send({'error':'INVALID_REQUEST_PARAMS'});
    }

    var result = {};
    var userInfo;

    var opt = {
        uid :   uid,
        username    :   username,
        upliveCode  :   upliveCode
    };

    for(var key in opt){
        if(!opt[key]){
            delete opt[key];
        }
    }

    if(!_.keys(opt).length){
        return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
    }

    async.waterfall([
        function (cb) {
            userModel.queryUserInfoByOpt(opt, function (err,data) {
                if(!err && !!data && data.length){
                    userInfo = data[0];
                    result.user = userInfo;
                }
                cb(err);
            });
        },
        function (cb) {
            if(!userInfo){
                console.error('no_user_info',opt);
                return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
            }
            statPersonalData(userInfo, function (err,data) {
                if(!err && !!data){
                    result.stats = data;
                }
                cb(err);
            });
        }
    ],function (err) {
        if(!err){
            return res.send(result);
        } else {
            console.log('queryRecordById-error>>>',err);
            return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
        }
    });
}

/**
 *
 * @param req {startTime: ,endTime: ,count: }
 * @param res
 */
function statGameCostData(startTime,endTime,count, next){
    var result = {};
    var totalCostRank = [],totalRewardRank = [];
    var sortByUid = {};
    var slotTimeGroup = {};
    var listOfPlayer = [];
    var costLog = [];
    var uids = [];

    var jackPotKey = redisKeyUtil.getKey('JACK_POT');
    var REWARD_POT = redisKeyUtil.getKey('REWARD_POT');
    var POINT002_DIAMOND_KEY = redisKeyUtil.getKey('POINT002_DIAMOND');
    var JACK_POT_DIAMOND = 0, REWARD_POT_DIAMOND = 0, POINT002_DIAMOND = 0;

    async.waterfall([
        function (cb) {
            costLogModel.queryCostLogInfoByOpt({createTime:{$gte:startTime,$lte:endTime}},function (err,data) {
                if(!err && !!data){
                    costLog = data;
                }
                cb(err);
            });
        },
        function (cb) {
            if(costLog.length){
                sortByUid = _.groupBy(costLog,'uid');
                uids = _.keys(sortByUid);
            }
            cb();
        },
        function (cb) {
            redisUtil.getRedisData(jackPotKey,function (err,data) {
                if(!err && !!data){
                    JACK_POT_DIAMOND = data;
                }
                cb(err);
            });
        },
        function (cb) {
            redisUtil.getRedisData(REWARD_POT,function (err,data) {
                if(!err && !!data){
                    REWARD_POT_DIAMOND = data;
                }
                cb(err);
            });
        },
        function (cb) {
            redisUtil.getRedisData(POINT002_DIAMOND_KEY,function (err,data) {
                if(!err && !!data){
                    POINT002_DIAMOND = data;
                }
                cb(err);
            });
        },
        function (cb) {
            result.startTime = (new Date(startTime) + '');
            result.endTime = (new Date(endTime) + '');
            result.allSlotTimes = costLog.length;
            result.uniqueUserCount = uids.length;
            result.jackpotDiamond = JACK_POT_DIAMOND;
            result.rewardpotDiamond = REWARD_POT_DIAMOND;
            result.point002Diamond = POINT002_DIAMOND;

            if(costLog.length){
                var costByLine = _.groupBy(costLog,'line');

                result.timesByLine = {};
                for(var key in costByLine){
                    var temp = costByLine[key];
                    var temp1 = _.groupBy(temp,'bet');
                    result.timesByLine[key] = {};
                    for(var bet in temp1){
                        result.timesByLine[key][bet] = temp1[bet].length;
                    }
                }

                var costGroup = _.groupBy(costLog,'cost');
                result.costGroup = {};
                for(var key in costGroup){
                    result.costGroup[key] = costGroup[key].length;
                }

                var totalCostDiamond = 0 ,totalRewardDiamond = 0;
                for(var uid in sortByUid){
                    var obj = {
                        uid :   uid
                    },
                        totalCost = 0,
                        totalReward = 0;

                    var playerRecord = sortByUid[uid];

                    slotTimeGroup[playerRecord.length] = slotTimeGroup[playerRecord.length] || 0;
                    slotTimeGroup[playerRecord.length] ++;

                    var costArray = _.pluck(playerRecord,'cost');
                    var rewardArray = _.pluck(playerRecord,'reward');

                    totalCost = _.reduce(costArray,function (memo,num) {
                        return memo + num;
                    });

                    totalReward = _.reduce(rewardArray,function (memo,num) {
                        return memo + num;
                    });

                    obj.totalCost = totalCost;
                    obj.totalReward = totalReward;

                    totalCostDiamond += totalCost;
                    totalRewardDiamond += totalReward;

                    listOfPlayer.push(obj);
                }

                result.totalCostDiamond = totalCostDiamond;
                result.totalRewardDiamond = totalRewardDiamond;

                result.slotTimeGroup = slotTimeGroup;

                totalCostRank = _.sortBy(listOfPlayer,'totalCost').reverse().splice(0,count);

                var array = [];
                for(var i = 0 ; i < totalCostRank.length; i++){
                    var obj = {
                        uid :   totalCostRank[i].uid,
                        cost :   totalCostRank[i].totalCost
                    };
                    array.push(obj);
                }
                result.totalCostRank = array;

                totalRewardRank = _.sortBy(listOfPlayer,'totalReward').reverse().splice(0,count);

                array = [];
                for(var i = 0 ; i < totalRewardRank.length; i++){
                    var obj = {
                        uid :   totalRewardRank[i].uid,
                        reward :   totalRewardRank[i].totalReward
                    };
                    array.push(obj);
                }
                result.totalRewardRank = array;

            }
            cb();
        }
    ],function (err) {
        if(!!err){
            console.log('statGameCostData>>>>',err);
        }
        next(err,result);
    });
}

function queryRecordByPeriods(req,res){
    if (!util.gameConfig.db_util) {
        return res.send({});
    }

    var startTime = parseFloat(req.body.startTime);
    var endTime = parseFloat(req.body.endTime);
    var count = parseInt(req.body.count);

    console.log('startTime>>>>>>>>',startTime);
    console.log('endTime>>>>>>>>',endTime);
    console.log('count>>>>>>>>',count);

    if(!startTime || !endTime || !count){
        return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
    }

    statGameCostData(startTime,endTime,count, function (err,data) {
        if(!err && !!data){
            return res.send(data);
        } else {
            console.log('queryRecordByPeriods-error:',err);
            return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
        }
    });
}


function timingStatMail() {
    if (!util.gameConfig.enable_jobs) {
        return;
    }

    var nextTime = util.getNextJobTime(6);
    console.log('timingStatMail-nextTime>>>>>>>>>>', new Date(nextTime));
    var leftTime = nextTime - Date.now();
    var hour = 6 * 60 * 60 * 1000;
    // 临时测试
    // hour = 1 * 60 * 1000;
    // leftTime = 0.5 * 60 * 1000;

    console.log('距离下次定时发统计邮件还有 '+ (leftTime / (60 * 1000)) + ' 分钟');
    setTimeout(function () {
        sendStatMail();
        setTimeout(arguments.callee, hour);
    }, leftTime)
}

//每隔6小时 发送邮件
function sendStatMail() {
    var endTime = Date.now();
    var startTime = endTime - 6 * 60 * 60 * 1000;
    statGameCostData(startTime,endTime,100,function (err,data) {
        var result = {};
        if(!err && !!data){
            result = data;
        }
        nodeMailer.sendAlarmMail('upslot-stats-' + util.gameConfig.server_name, JSON.stringify(result, null, 2));

        // 同时查询从始至终的
        statGameCostData(0,endTime,0,function (err,data) {
            var result = {};
            if(!err && !!data){
                result = data;
            }
            nodeMailer.sendAlarmMail('upslot-stats-from-begin-' + util.gameConfig.server_name, JSON.stringify(result, null, 2));
        });
    });
}


//每天晚上24点发送当天登录人数邮件
function sendCountOfPlayerMail() {
    if (!util.gameConfig.enable_jobs) {
        return;
    }

    var endTime = util.getMNTime().night;
    var oneDay = 24 * 60 * 60 * 1000;
    var leftTime = endTime - Date.now();

    setTimeout(function () {
        var startTime = Date.now() - oneDay;
        var endTime = Date.now();

        getLoginNumberOfOneDay(startTime,endTime,function (err,data) {
            var result = 0;
            if(!err && !!data){
                result = data;
            }
            nodeMailer.sendMail('upslot-stats-' + util.gameConfig.server_name,JSON.stringify({numberOfLogin:result,startTime:new Date(startTime),endTime:new Date(endTime) }));
        });
        setTimeout(arguments.callee,oneDay);
    },leftTime);
}

function getLoginNumberOfOneDay(startTime,endTime,cb) {
    var numberOfLogin = 0;
    userModel.queryUserInfoByOpt({loginTime:{$gt:startTime,$lt:endTime}},function (err,data) {
        if(!err && !!data){
            numberOfLogin = data.length;
        }
        cb(err,numberOfLogin);
    });
}

//获取玩家留存
function getRemain(req,res) {
    var startTime = parseInt(req.body.startTime),endTime = parseInt(req.body.endTime)-1000;
    var S = util.getMNTime(startTime).morning;
    var E = util.getMNTime(endTime).night;

    var players = [];
    var data = [];
    var dates = [];
    var uidsArr = [];
    var oneDay = 24 * 60 * 60 * 1000;

    var result = {};

    async.waterfall([
        function (cb) {
            userModel.queryUserInfoByOpt({createTime:{$lte:E,$gte:S}},function (err,info) {
                if(!err && !!info){
                    players = info;
                }
                cb(err);
            });
        },
        function (cb) {
            var uids = _.pluck(players,'uid');
            costLogModel.queryCostLogInfoByOpt({createTime:{$lte:E,$gte:S},uid:{$in:uids}},function (err,info) {
                if(!err && !!info){
                    data = info;
                }
                cb(err);
            });
        },
        function (cb) {
            console.log('getRemain-data:',data.length);
            for(var i = S;i < E;i += oneDay){
                var uids = [];
                data.forEach(function (item) {
                    if(i <= item.createTime && item.createTime <= i+oneDay){
                        uids.push(item.uid);
                    }
                });
                var date = new Date(i).getDate();
                dates.push(date);
                var temp = _.uniq(uids);
                result[date] = {};
                result[date].count = temp.length;
                uidsArr.push(temp);
            }
            console.log('dates>>>>>>',dates);
            cb();
        },
        function (cb) {
            console.log('uidsArr>>>>>>>',uidsArr.length);
            for(var i = 0 ; i < uidsArr.length ; i++){
                var n1 = uidsArr[i].length;
                var n2,count;
                for(var j = i + 1 ; j < uidsArr.length ; j++){
                    var n3 = uidsArr[j].length;
                    n2 = _.union(uidsArr[i],uidsArr[j]).length;
                    count = n1 + n3 - n2;
                    result[dates[i]][dates[j]] = count;
                }
            }
            cb();
        }
    ],function (err) {
        console.log('error:',err);
        return res.send({remain : result});
    });
}


/**
 * 获取奖池中得数据、奖池自动填充的数值和次数、奖池百分比的3个大奖信息
 */
function getJackPotDiamond(req,res) {
    if (!util.gameConfig.db_util) {
        return res.send({});
    }

    var jackPotKey = redisKeyUtil.getKey('JACK_POT');
    var REWARD_POT = redisKeyUtil.getKey('REWARD_POT');
    var POINT002_DIAMOND_KEY = redisKeyUtil.getKey('POINT002_DIAMOND');

    var winningRecordKey = redisKeyUtil.getKey('WINNING_RECORD');

    var fillTimes = 0,fillDiamond = 0;
    var JACK_POT_DIAMOND = 0, REWARD_POT_DIAMOND = 0, POINT002_DIAMOND = 0;
    var winningRecord = {};

    async.waterfall([
        function (cb) {
            redisUtil.getRedisData(jackPotKey,function (err,data) {
                if(!err && !!data){
                    JACK_POT_DIAMOND = data;
                }
                cb(err);
            });
        },
        function (cb) {
            redisUtil.getRedisData(REWARD_POT,function (err,data) {
                if(!err && !!data){
                    REWARD_POT_DIAMOND = data;
                }
                cb(err);
            });
        },
        function (cb) {
            redisUtil.getRedisData(POINT002_DIAMOND_KEY,function (err,data) {
                if(!err && !!data){
                    POINT002_DIAMOND = data;
                }
                cb(err);
            });
        },
        function (cb) {
            redisUtil.getRedisData(fillTimesKey,function (err,data) {
                if(!err && !!data){
                    fillTimes = data;
                }
                cb(err);
            })
        },
        function (cb) {
            redisUtil.getRedisData(fillDiamondKey,function (err,data) {
                if(!err && !!data){
                    fillDiamond = data;
                }
                cb(err);
            })
        },function (cb) {
            redisUtil.getRedisData(winningRecordKey,function (err,data) {
                if(!err && !!data){
                    winningRecord = data;
                }
                cb(err);
            })
        }
    ],function (err) {
        return res.send({
            JACK_POT_DIAMOND :JACK_POT_DIAMOND,
            REWARD_POT_DIAMOND : REWARD_POT_DIAMOND,
            POINT002_DIAMOND : POINT002_DIAMOND,
            fillTimes   :   fillTimes,
            fillDiamond :   fillDiamond,
            winningRecord   :   winningRecord
        });
    });
}

function resetJackPotDiamond(req,res) {
    if (!util.gameConfig.db_util) {
        return res.send({});
    }

    var jackPotKey = redisKeyUtil.getKey('JACK_POT');
    var REWARD_POT = redisKeyUtil.getKey('REWARD_POT');

    var JACK_POT_DIAMOND = 0,REWARD_POT_DIAMOND = 0;

    async.waterfall([
        function (cb) {
            redisUtil.getRedisData(jackPotKey,function (err,data) {
                if(!err && !!data){
                    JACK_POT_DIAMOND = data;
                }
                cb(err);
            });
        },
        function (cb) {
            redisUtil.DECRBY(jackPotKey,JACK_POT_DIAMOND,function (err) {
                cb(err);
            });
        },
        function (cb) {
            redisUtil.getRedisData(REWARD_POT,function (err,data) {
                if(!err && !!data){
                    REWARD_POT_DIAMOND = data;
                }
                cb(err);
            });
        },
        function (cb) {
            redisUtil.DECRBY(REWARD_POT,REWARD_POT_DIAMOND,function (err) {
                cb(err);
            });
        }
    ],function (err) {
        var result = {
            JACK_POT_DIAMOND    :   JACK_POT_DIAMOND,
            REWARD_POT_DIAMOND  :   REWARD_POT_DIAMOND,
            error   :   err
        };
        var nodemailer = require('../model/nodemailer');
        nodemailer.sendMail('slot-server-admin-reset-jackpot-'+util.gameConfig.server_name,JSON.stringify(result,null,2));
        return res.send({status : 'ok'});
    });
}

function resetRanking(req,res) {
    if (!util.gameConfig.db_util) {
        return res.send({});
    }

    var SLOT_RANKING = redisKeyUtil.getKey('SLOT_RANKING');

    async.waterfall([
        function (cb) {
            redisUtil.deleteRedisData(SLOT_RANKING, function (err) {
                cb(err);
            });
        },
        function (cb) {
            var userModel = require('./userModel');
            userModel.updateUser({},{awardDiamond:0},{multi:true},function (err) {
                cb(err);
            });
        }
    ],function (err) {
        return res.send({status : 'ok',error:err});
    });
}

//加道具
function addPoint(req,res) {
    var point001 = req.body.point001 || 0;
    var point002 = req.body.point002 || 0;

    userModel.queryUserInfo(req.body.id,function (err,data) {
        data.point001 += parseInt(point001);
        data.point002 += parseInt(point002);
        data.save(function (err) {
            return res.send({status : 'ok', point001:data.point001,point002:data.point002});
        });
    });
}

//修改抽奖池数据
function changeJackPot(req,res) {
    var value = parseInt(req.body.jackpot);

    if(value <= 0){
        return res.send({error:'INVALID_REQ_PARAMS'});
    }

    var JACK_POT = redisKeyUtil.getKey('JACK_POT');
    var old_value = 0;

    async.waterfall([
        function (cb) {
            redisUtil.getRedisData(JACK_POT, function (err,data) {
                if(!err && !!data){
                    old_value = data;
                }
                cb(err);
            });
        },
        function (cb) {
            redisUtil.setRedisData(JACK_POT, value, function (err) {
                cb(err);
            });
        }
    ],function (err) {
         
    });
}

var totalCostKey = redisKeyUtil.getKey('TOTAL_COST');
var totalRewardKey = redisKeyUtil.getKey('TOTAL_REWARD');
var rewardLevelKey = redisKeyUtil.getKey('REWARD_LEVEL');
var POT_KEY = redisKeyUtil.getKey('JACK_POT');

//查询上帝之手信息
function getHandsOfGodData(req,res) {
    var uid = req.body.id;
    if(!uid ){
        return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
    }
    var userInfo;
    var result = {};
    
    async.waterfall([
        function (cb) {
            userModel.getUser(uid,function (err,data) {
                if(!err && !!data){
                    userInfo = data;
                }
                cb();
            });
        },
        function (cb) {
            if (!userInfo) {
                return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
            }
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
        }
    ],function (err) {
        if(!err){
            return res.send(result);
        }
    })
    
}

// 修改上帝之手中用户身上的信息
function setPlayerDataHandsOfGod(req,res) {
    console.log('req.body',req.body);
    var uid = req.body.uid_g;
    var totalCost = parseInt(req.body.totalCost);
    var dayCost = parseInt(req.body.dayCost);
    var totalReward = parseInt(req.body.totalReward);
    var dayReward = parseInt(req.body.dayReward);
    var total520 = parseInt(req.body.total520);
    var total920 = parseInt(req.body.total920);
    var day520 = parseInt(req.body.day520);
    var day920 = parseInt(req.body.day920);

    userModel.queryUserInfo(uid,function (err,data) {
        console.log('data.dayRecord--------------',data.dayRecord);

        data.totalCostDiamond = parseInt(totalCost);
        data.dayCostDiamond = dayCost;
        data.totalAwardDiamond = totalReward;
        data.dayAwardDiamond = dayReward;
        data.dayRecord['5*20'] = day520;
        data.dayRecord['9*20'] = day920;
        data.allRecord['5*20'] = total520;
        data.allRecord['9*20'] = total920;

        data.save(function (err) {
            if(!err){
                return res.send({status : 'ok',1:data.totalCostDiamond,2:data.dayCostDiamond,3:data.totalCostDiamond-data.totalAwardDiamond,
                4:data.dayCostDiamond-data.dayAwardDiamond,5:data.allRecord['5*20'],6:data.allRecord['9*20'],7:data.dayRecord['5*20'],
                    8:data.dayRecord['9*20']});
            }else{
                return res.send({status : 'error'})
            }
        })
    })
}

//修改上帝之手中 全局redis中的信息
function setRedisDataHandsOfGod(req,res) {
    var totalCostKey = redisKeyUtil.getKey('TOTAL_COST');
    var totalRewardKey = redisKeyUtil.getKey('TOTAL_REWARD');

    var rewardLevelKey = redisKeyUtil.getKey('REWARD_LEVEL');
    var jackPotKey = redisKeyUtil.getKey('JACK_POT');

    var rewardLevel = {};
    rewardLevel['1'] = parseInt(req.body.rewardLevel1);
    rewardLevel['2'] = parseInt(req.body.rewardLevel2);
    rewardLevel['3'] = parseInt(req.body.rewardLevel3);
    var allTotalCost = parseInt(req.body.allTotalCost);
    var allTotalReward = parseInt(req.body.allTotalReward);
    var jackPot = parseInt(req.body.jackPot);

    console.log('setRedisDataHandsOfGod: ', req.body);

    async.waterfall([
        function (cb) {
            redisUtil.setRedisData(totalCostKey,allTotalCost,function (err) {
                cb(err);
            });
        },
        function (cb) {
            redisUtil.setRedisData(totalRewardKey,allTotalReward,function (err) {
                cb(err);
            });
        },
        function (cb) {
            redisUtil.setRedisData(jackPotKey,jackPot,function (err) {
                cb(err);
            });
        },
        function (cb) {
            var rewardLevelArr = [];
            for(var key in rewardLevel){
                rewardLevelArr.push({'rewardlevel':key,'times':parseInt(rewardLevel[key])})
            }
            async.mapSeries(rewardLevelArr,function (item, call) {
                redisUtil.redisHset(rewardLevelKey,item.rewardlevel,item.times,function (err) {
                    call(err);
                });
            }, function (err) {
                cb(err);
            });
        }
    ],function (err) {
        if(!err){
            return res.send({status:'ok',1:rewardLevel['1'],2:rewardLevel['2'],3:rewardLevel['3'],4:allTotalCost-allTotalReward,
            5:jackPot});
        }
    })
}


module.exports = {
    queryRecordById     :   queryRecordById,
    queryRecordByPeriods:   queryRecordByPeriods,
    timingStatMail      :   timingStatMail,
    statPersonalData    :   statPersonalData,
    sendCountOfPlayerMail:  sendCountOfPlayerMail,
    getRemain           :   getRemain,
    getJackPotDiamond   :   getJackPotDiamond,
    resetJackPotDiamond :   resetJackPotDiamond,
    resetRanking        :   resetRanking,
    addPoint            :   addPoint,
    getHandsOfGodData   :   getHandsOfGodData,
    setPlayerDataHandsOfGod :   setPlayerDataHandsOfGod,
    setRedisDataHandsOfGod  :   setRedisDataHandsOfGod
}