/**
 * 累积奖池模块
 * Created by lixiaodong on 17/1/4.
 */

var async = require('async');
var util = require('../util/util');
var configUtil = require('../util/configUtil');
var redisKeyUtil = require('../util/redisKeyUtil');
var redisUtil = require('../util/redisUtil');
var slotModel = require('../model/slot');
var queueModel = require('../model/queue');
// var nodeMailer = require('../model/nodemailer');
var slotsgamepotcontrol = configUtil.getConfigByName('slotsgamepotcontrol');

var LAST_SLOT_TIME = redisKeyUtil.getKey('LAST_SLOT_TIME');
var POT_KEY = redisKeyUtil.getKey('JACK_POT');
var REWARD_POT_KEY = redisKeyUtil.getKey('REWARD_POT');

function getTotalDiamondFromPot(next){
    var diamond = 0;
    redisUtil.getRedisData(POT_KEY,function (err,data) {
        if(!err && !!data){
            diamond = parseInt(data);
        }
        next(err,diamond);
    });
}

/**
 * 根据抽奖池的U钻数 获取最新的抽成率
 * @param jackPotDiamond
 */
function getFreshRatePoint(jackPotDiamond){
    if (jackPotDiamond < 0) {
        jackPotDiamond = 0;
    }
    for(var i = 0 ; i < slotsgamepotcontrol.length; i++){
        if(jackPotDiamond >= slotsgamepotcontrol[i].potMin && jackPotDiamond <= slotsgamepotcontrol[i].potMax){
            return slotsgamepotcontrol[i].ratePoint.toFixed(2);
        }
    }
}

function slotFromJackPotTask(req,next){
    var uid = req.body.uid;
    var costDiamond = parseInt(req.body.diamond);
    var line = parseInt(req.body.line);
    var numOfGetReward = req.body.numOfGetReward;
    var resultOfLine = null;
    var isFree = (req.body.isFree + '') == 'true';
    var jackPotDiamond = 0, rate = 0;
    var awardObj = null;
    var rewardRate = req.body.rewardRate;

    var left = 0, choucheng = 0;
    var SlotModel = require('./slotModel');

    async.waterfall([
        function (cb) {
            SlotModel.getDataFromRedis(uid, line, costDiamond, function (err,data) {
                if(!err && !!data){
                    resultOfLine = data;
                }
                cb(err);
            });
        },
        function (cb) {
            console.log('resultOfLine: ', resultOfLine);
            getTotalDiamondFromPot(function (err,data) {
                if(!err && !!data){
                    jackPotDiamond = data;
                }
                cb(err);
            });
        },
        function (cb) {
            //收益池 净收益
            rate = getFreshRatePoint(jackPotDiamond);
            choucheng = parseInt(line * costDiamond * (1 - rate));

            // 免费次数需要从奖池中扣除抽成，并且不增加收益池
            if (isFree) {
                left = 0 - choucheng;
                console.log('免费次数从奖池中抽成:', choucheng);
                return cb();
            } else {
                left = parseInt(line * costDiamond) - choucheng;
                // 收益池
                redisUtil.INCRBY(REWARD_POT_KEY,choucheng, function (err) {
                    cb(err);
                });
            }
        },
        function (cb) {
            var params = {
                line:   line,
                costDiamond:    costDiamond,
                jackPotDiamond: jackPotDiamond,
                free: isFree,
                resultOfLine:resultOfLine,
                numOfGetReward   :   numOfGetReward,
                rewardRate:rewardRate
            };

            awardObj = slotModel.getRewardFromPool(params);
            awardObj.rewardDiamond *= rewardRate;
            var incrDiamond = left - parseInt(awardObj.rewardDiamond);

            console.log('抽成: ', choucheng, '用户得奖: ',awardObj.rewardDiamond , '抽奖池增加: ', incrDiamond);

            redisUtil.INCRBY(POT_KEY, incrDiamond, function (err) {
                cb(err);
            });
        },
        function (cb) {
            SlotModel.updateRedisOfHandsOfGod(awardObj,isFree ? 0 : parseInt(costDiamond * line),function (err) {
                cb(err);
            });
        }
    ],function (err) {
        console.log('awardObj>>>',awardObj);
        next(err,awardObj);
    });
}

/**
 * 从奖池中抽取奖励
 * @param req
 * @param res
 */
function slotFromJackPot(req,res){
    queueModel.pushTask(slotFromJackPotTask.bind(null,req),function (err,data) {
        return res.send({error : err, award:data});
    });
}


exports.slotFromJackPot = slotFromJackPot;
exports.getTotalDiamondFromPot = getTotalDiamondFromPot;