/**
 * Created by lixiaodong on 16/12/22.
 */

var async = require('async');
var redisKeyUtil = require('../util/redisKeyUtil');

var SLOT_PLAYER = redisKeyUtil.getLobbyKey('SLOT_PLAYER');
var SLOT_RANKING = redisKeyUtil.getKey('SLOT_RANKING');

var util = require('../util/util');
var configUtil = require('../util/configUtil');

// var userModel = require('./userModel');
var errorCode = require('../errorCode');

var rankingManager = require('../model/ranking');

function updateRanking(userInfo, next) {
    async.waterfall([
        function (cb) {
            if(userInfo.haveParty){
                rankingManager.updatHavePartyRanking(userInfo,function (err) {
                    cb(err);
                });
            }else{
                cb();
            }
        },
        function (cb) {
            if(userInfo.awardDiamond >= 2000){
                rankingManager.updateRanking(userInfo,function (err) {
                    cb(err);
                });
            } else {
                cb();
            }
        }
    ],function (err) {
        next(err);
    });
}

/**
 * 获取排行榜接口 鸿运榜
 * @param req
 * @param res
 */
function getRanking(req,res) {
    var uid = req.body.id;
    var type = req.body.type;//1总收益 2开party次数

    if(!uid){
        return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
    }

    var userInfo;
    var result = {};
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
            if(!userInfo){
                return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
            }

            rankingManager.getRanking(userInfo, type,function (err, data) {
                if (!err && !!data) {
                    result = data;
                }
                cb(err);
            });
        }
    ],function (err) {
        if(!err){
            return res.send(result);
        } else {
            return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
        }
    });
}

module.exports = {
    updateRanking   :   updateRanking,
    getRanking      :   getRanking
}