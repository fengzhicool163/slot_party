/**
 * Created by lixiaodong on 16/12/22.
 */
var async = require('async');
var _ = require('underscore');
var rankManager = require('./rankingManager');

var redisKeyUtil = require('../util/redisKeyUtil');
var SLOT_RANKING = redisKeyUtil.getKey('SLOT_RANKING');
var MAX_REWARD_RANK = redisKeyUtil.getKey('MAX_REWARD_RANK');
var HAVE_PARTY_TIMES = redisKeyUtil.getKey('HAVE_PARTY_TIMES');

var redisUtil = require('../util/redisUtil');
var configUtil = require('../util/configUtil');
// var mailModel = require('../routes/mailModel');
var activityModel = require('../model/activity');
var util = require('../util/util');
var rankUtilModel = new rankManager({rankKey : SLOT_RANKING});
var havePartyUtilModel = new rankManager({rankKey : HAVE_PARTY_TIMES});
var SLOT_PLAYER = redisKeyUtil.getLobbyKey('SLOT_PLAYER');

var Ranking = function () {
    this.initSettlement();
}

Ranking.prototype.initSettlement = function () {
    var self = this;
    if (util.gameConfig.enable_jobs) {
        console.log('game job is enabled');
        var endTime = activityModel.getActivityEndTime();
        var func = self.settlement.bind(self);
        rankUtilModel.settlement(func, endTime);
    } else {
        console.log('game job is disabled');
    }
}

Ranking.prototype.updateRanking = function (userInfo, next) {
    var field = userInfo.uid;
    var value = userInfo.awardDiamond;
    var endTime = activityModel.getActivityEndTime();
    if(endTime <= Date.now()){
        return next();
    }

    rankUtilModel.updateRanking(field, value ,function (err) {
        next(err);
    });
}

Ranking.prototype.updatHavePartyRanking = function (userInfo, next) {
    var field = userInfo.uid;
    var value = userInfo.haveParty;

    havePartyUtilModel.updateRanking(field, value ,function (err) {
        next(err);
    });
}

Ranking.prototype.getRanking = function(userInfo,type, next) {
    var ranking = [],listOfPlayerInfo = [];
    var myRanking = {
        username    :   userInfo.username,
        avatar      :   userInfo.avatar,
        grade       :   userInfo.grade,
        ranking     :   0,
        diamond     :   0
    };

    var uid = userInfo.uid;
    var model ;
    if(type == 1){
        model = rankUtilModel;
    }else if(type == 2){
        model = havePartyUtilModel;
    }

    async.waterfall([
        function (cb) {
            model.getRankingWithScoreByRange(20,function (err,data) {
                if(!err && !!data){
                    ranking = data;
                }
                cb(err);
            });
        },
        function (cb) {
            if(ranking.length){

                var uids = _.pluck(ranking,'id');
                redisUtil.redisHMGet(SLOT_PLAYER, uids,function (err,data) {
                    if(!err && !!data){
                        listOfPlayerInfo = data;
                    }
                    cb(err);
                });
            } else {
                cb();
            }
        },
        function (cb) {
            if(listOfPlayerInfo.length){
                var playerInfoByUid = _.indexBy(listOfPlayerInfo, 'uid');

                for(var i = 0 ; i < ranking.length; i++){
                    var playerId = ranking[i].id;
                    if(!!playerInfoByUid[playerId]){
                        ranking[i].uid = playerId;
                        ranking[i].username = playerInfoByUid[playerId].username;
                        ranking[i].avatar = playerInfoByUid[playerId].avatar;
                        ranking[i].grade = playerInfoByUid[playerId].grade;
                        ranking[i].upliveCode = playerInfoByUid[playerId].upliveCode;
                        ranking[i].diamond = ranking[i].value;
                        delete ranking[i].id;
                        delete ranking[i].value;
                        if(playerId == uid){
                            myRanking = ranking[i];
                        }
                    }
                }
            }

            if(!myRanking.ranking){
                model.getRankByUid(uid, function (err,data) {
                    if(!err && !!data){
                        myRanking.ranking = data;
                    }
                    cb(err);
                });
            } else {
                cb();
            }
        },
        function (cb) {
            if(!myRanking.diamond){
                model.getScoreByUid(uid,function (err,data) {
                    if(!err && !!data){
                        myRanking.diamond = data;
                    }
                    cb(err);
                });
            } else {
                cb();
            }
        }
    ],function (err) {
        next(err,{ranking   :   ranking, myRanking  :myRanking});
    });
}


/**
 * 
 */
Ranking.prototype.settlement = function () {
    var listOfRanking = [];
    
    var rankArray = [];
    var listOfPlayerInfo = [];
    var length = 0;

    async.waterfall([
        function (cb) {
            maxRewardUtilModel.getRankingLength(function (err,data) {
                if(!err && !!data){
                    length = data;
                }
                cb(err);
            });
        },
        function (cb) {
            maxRewardUtilModel.getRankingWithScoreByRange(length,function (err,data) {
                if(!err && !!data){
                    listOfRanking = data;
                }
                cb(err);
            });
        },
        function (cb) {
            if(listOfRanking.length){
                var uids = _.pluck(listOfRanking,'id');
                redisUtil.redisHMGet(SLOT_PLAYER, uids, function (err,data) {
                    if(!err && !!data){
                        listOfPlayerInfo = data;
                    }
                    cb(err);
                });
            } else {
                cb();
            }
        },
        function (cb) {
            var playerInfoByUid = _.indexBy(listOfPlayerInfo,'uid');

            var rankLogModel = require('../routes/rankLogModel');

            for(var i = 0 ; i < listOfRanking.length; i++){
                var rank = listOfRanking[i];
                var uid = rank.id;

                var obj = {};
                for(var key in rank){
                    obj[key] = rank[key];
                }

                if(playerInfoByUid[uid]){
                    var playerInfo = playerInfoByUid[uid];
                    for(var key in playerInfo){
                        obj[key] = playerInfo[key];
                    }
                }

                rankArray.push(obj);
            }

            rankLogModel.addRankLog(rankArray, function (err) {
                cb(err);
            });
        },
        function (cb) {
            //清理公告
            var NOTICE_KEY = redisKeyUtil.getKey('NOTICE_KEY');
            redisUtil.deleteRedisData(NOTICE_KEY,function (err) {
                cb(err);
            });
        }
    ],function (err) {
    });
}

module.exports = new Ranking();