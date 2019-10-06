/**
 * Created by lixiaodong on 16/12/22.
 */
var async = require('async');
var request = require('request');
var errorCode = require('../errorCode');
var userModel = require('./userModel');
var redisKeyUtil = require('../util/redisKeyUtil');
var redisUtil = require('../util/redisUtil');
var SLOT_PLAYER = redisKeyUtil.getLobbyKey('SLOT_PLAYER');
var util = require('../util/util');
var actModel = require('../model/activity');

/**
 * 登录接口 同步游戏大厅数据
 * @param req
 * @param res
 */
function login(req,res) {
    var uid = req.body.uid;

    var userInfo, create = false;

    var result = {};

    async.waterfall([
        function (cb) {
            userModel.queryUserInfo(uid, function (err,data) {
                if(!err && !!data){
                    userInfo = data;
                }
                cb(err);
            });
        },
        function (cb) {
            if(!userInfo){
                userInfo = {
                    uid:    uid
                };
                create = true;
            }
            //同步大厅用户数据
            redisUtil.redisHGet(SLOT_PLAYER, uid, function(err,data){
                if(!err && !!data){
                    userInfo.diamond = parseInt(data.diamond);
                    userInfo.username = data.username;
                    userInfo.userToken = data.userToken;
                    userInfo.upliveCode = data.upliveCode;
                    userInfo.gender = data.gender;
                    userInfo.grade = data.grade;
                    userInfo.avatar = data.avatar;
                    userInfo.taskStatus = data.taskStatus;
                    userInfo.taskCount = data.taskCount;
                }
                cb(err);
            });
        },
        function (cb) {
            if(create){
                userModel.createUser(userInfo, function (err,data) {
                    if(!err && !!data){
                        userInfo = data;
                    }
                    cb(err);
                });
            } else {
                cb();
            }
        },
        function (cb) {
            userInfo.loginTime = Date.now();
            userInfo.save(function (err) {
                cb(err);
            });
        }
    ],function (err) {
        if(!!err){
            return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
        }
        result.user = userInfo;
        result.status = "ok";
        result.serverTime = Date.now();
        result.activityEndTime = actModel.getActivityEndTime();
        return res.send(result);
    });
}


module.exports = {
    login   :   login
}