/**
 * 公告模块 存储在redis
 * Created by lixiaodong on 16/12/23.
 */

// var async = require('async');
// var redisUtil = require('../util/redisUtil');
// var redisKeyUtil = require('../util/redisKeyUtil');
// var NOTICE_KEY = redisKeyUtil.getLobbyKey('NOTICE_KEY');
// // var errorCode = require('../errorCode');
// var userModel = require('./userModel');
// var configUtil = require('../util/configUtil');
// var gamecontent = configUtil.getConfigByName('slotsgamecontent')[0]

// function pushNotice(notice,next) {
//     var length = 0;
//     notice.gameId = gamecontent.gameId;
//     async.waterfall([
//         function (cb) {
//             redisUtil.redisLPush(NOTICE_KEY, notice, function (err) {
//                 cb(err);
//             });
//         },
//         function (cb) {
//             redisUtil.redisLLen(NOTICE_KEY, function (err,data) {
//                 if(!err && !!data){
//                     length = data;
//                 }
//                 cb(err);
//             });
//         },
//         function (cb) {
//             if(length >= 20){
//                 redisUtil.redisRPop(NOTICE_KEY,function (err) {
//                     cb(err);
//                 });
//             } else {
//                 cb();
//             }
//         }
//     ],function (err) {
//         next(err);
//     });
// }
//
// function getNotice(req,res) {
//     if(!req.body.id){
//         return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
//     }
//     var uid = req.body.id;
//     var notices = [];
//     var userInfo;
//
//     async.waterfall([
//         function (cb) {
//             userModel.queryUserInfo(uid,function (err,data) {
//                 if(!err && !!data){
//                     userInfo = data;
//                 }
//                 cb(err);
//             });
//         },
//         function (cb) {
//             if(!userInfo){
//                 return res.send({notices : notices});
//             }
//             redisUtil.redisLRange(NOTICE_KEY, 100, function (err,data) {
//                 if(!err && !!data){
//                     notices = data;
//                 }
//                 cb(err);
//             });
//         },
//         function (cb) {
//             if(notices.length){
//                 var startTime = userInfo.getNoticeTime - 30 * 60 * 1000;
//                 notices = notices.filter(function (item) {
//                     return item.createTime >= startTime;
//                 });
//             }
//             cb();
//         },
//         function (cb) {
//             userInfo.getNoticeTime = Date.now();
//             userInfo.save(function (err) {
//                 cb(err);
//             });
//         }
//     ],function (err) {
//         if(!err){
//             return res.send({notices : notices});
//         } else {
//             return res.send({notices : []})
//         }
//     });
// }

// module.exports = {
    // pushNotice  :   pushNotice,
    // getNotice   :   getNotice
// }