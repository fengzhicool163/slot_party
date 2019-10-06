/**
 * 中奖记录
 * Created by lixiaodong on 17/3/6.
 */
var async = require('async');

var redisKeyUtil = require('../util/redisKeyUtil');
var redisUtil = require('../util/redisUtil');
var winningKey = redisKeyUtil.getKey('WINNING_RECORD');

/**
 *
 * @param userInfo
 * @param rewardDiamond 获得的U钻
 * @param winning 是否获得大奖
 * @param next
 */
function updateWinningRecord(userInfo, rewardDiamond, winning, next) {
    var result = {};
    console.log('updateWinningRecord: ', rewardDiamond, winning);
    async.waterfall([
        function (cb) {
            if(winning && rewardDiamond){
                var freshRecord = {
                    username    :   userInfo.username,
                    diamond     :   rewardDiamond,
                    avatar      :   userInfo.avatar,
                    createTime  :   Date.now()
                };
                console.warn('updateWinningRecord: ', freshRecord);
                redisUtil.redisLPush(winningKey,freshRecord,function (err) {
                    cb(err);
                });
            } else {
                cb();
            }
        },
        function (cb) {
            queryWinningRecord(userInfo, function (err,data) {
                if(!err){
                    result.records = data;
                }
                cb(err);
            });
        }
    ],function (err) {
        next(err,result);
    });
}

function queryWinningRecord(userInfo, next) {
    var length = 0;
    var records = [];

    async.waterfall([
        function (cb) {
            redisUtil.redisLLen(winningKey, function (err,data) {
                if(!err && !!data){
                    length = data;
                }
                cb();
            });
        },
        function (cb) {
            redisUtil.redisLRange(winningKey, length, function (err,data) {
                if(!err && !!data){
                    records = data;
                }
                cb(err);
            });
        }
    ],function (err) {
        console.log('queryWinningRecord records.length: ', length, records.length);
        if(records.length){
            records = records.splice(0,3).reverse();
        }
        next(err,records);
    });
}

function getWinningRecord(req,res) {
    var uid = req.body.id;
    var userModel = require('./userModel');

    var userInfo, result = {};
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
                return res.send({records: records});
            }
            queryWinningRecord(userInfo, function (err,data) {
                if(!err){
                    result.records = data;
                }
                cb(err);
            });
        }
    ],function (err) {
        result.error = err;
        return res.send(result);
    });
}

module.exports = {
    getWinningRecord:   getWinningRecord,
    updateWinningRecord:    updateWinningRecord,
    queryWinningRecord: queryWinningRecord
}