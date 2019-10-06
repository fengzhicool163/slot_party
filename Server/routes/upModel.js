/**
 * Created by lixiaodong on 16/12/23.
 */

var crypto = require('crypto');
var request = require('request');
var constants = require('constants');
var cryptoModel = require('../model/crypto');
var config = require('../config.json');
var util = require('../util/util');
var gameConfig = util.gameConfig;


var urls = {
    getBalanceInfo  :   gameConfig.hostUrl+"getBalanceInfo",
    buyLuckDrawChance:  gameConfig.hostUrl+"buyLuckDrawChance",
    sendReward      :   gameConfig.hostUrl+"sendReward",
    getUserInfo     :   gameConfig.hostUrl+"getUserInfo",
    getSendOutDiamond:  gameConfig.hostUrl+"getSendOutDiamond"
};

function getRequestOption(raw, uri) {
    return {
        url :   uri,
        body    :   raw,
        headers :   {
            'appId'  :   config.app_id
        },
        timeout :   15000
    }
}

function requestMethod(option, next) {
    request.post(option, function (err,resp,body) {
        if(!err && !!body){
            body = cryptoModel.decrypt(body);
            if(body.code != 'N000000'){
                console.error('up-error:', err, body);
                err = body.code;
            }
        }
        next(err,body);
    });
}

/**
 * 获取最新的U钻
 * @param opt
 * @param next
 */
function getBalanceInfo(opt, next) {
    var uid = parseFloat(opt.uid);

    var reqParams = {
        uid     :   uid
    };

    var raw = cryptoModel.encrypt(reqParams);

    var options = getRequestOption(raw, urls.getBalanceInfo);

    var diamond = 0;

    requestMethod(options, function (err,data) {
        if(!err && !!data){
            if(typeof data == 'string'){
                data = JSON.parse(data);
            }
        }
        if(!err && !!data && !!data.info && !!data.info.userBalanceInfo){
            diamond = data.info.userBalanceInfo.diamond || 0;
        }
        next(err,diamond);
    });
}

/**
 * 花费U钻
 * return {"code":"N000000","info":NULL,"message":"SUCCESS"}
 * @param opt
 * @param next
 */
function buyLuckDrawChance(opt, next) {
    var uid = parseFloat(opt.uid);
    var diamond = parseInt(opt.diamond);
    var orderId = util.createOrderId();
    orderId = uid + '－' + orderId + '-' + config.app_id;

    var reqParams = {
        uid     :   uid,
        diamond :   diamond,
        orderId :   orderId
    };

    var raw = cryptoModel.encrypt(reqParams);
    var options = getRequestOption(raw, urls.buyLuckDrawChance);

    requestMethod(options, function (err,data) {
        next(err,data);
    });
}

/**
 * return {"code":"N000000","info":null,"message":"SUCCESS"}
 * @param opt
 * @param next
 */
function sendReward(opt, next) {
    var uid = parseFloat(opt.uid);
    var diamond = parseFloat(opt.diamond);
    var orderId = util.createOrderId();
    orderId = uid + '-' + orderId + '-' + config.app_id;
    //type 1:u钻 2经验值
    var reqParams = {
        uid     :   uid,
        type    :   1,
        amount  :   diamond,
        orderId :   orderId
    };

    var raw = cryptoModel.encrypt(reqParams);
    var options = getRequestOption(raw, urls.sendReward);

    requestMethod(options, function (err,data) {
        next(err,data);
    });
}

/**
 * {
    "code":"N000000",
    "message":"SUCCESS",
    "info":"
    {
      "avatar": "http://p.cdn.pengpengla.com/uplive/p/u/2016/5/31/1c759a4b-25c7-4f53-b782-cd2d59143700.jpg",   //用户头像
      "expValue": 0,        //经验值
      "isOnline": 0,        //在线状态，0：不在线，1：在线
      "uid": 10,            //用户uid
      "upliveCode": "",     //upliveCode
      "username": "哈哈哈"   //昵称
    }"
}
 * @param uid
 * @param next
 */
function getUserInfo(uid,next){
    var reqParams = {
        word    : parseFloat(uid),
        type    :   0
    };

    var raw = cryptoModel.encrypt(reqParams);
    var options = getRequestOption(raw, urls.getUserInfo);

    requestMethod(options, function(err,body){
        if(!err){
            body = body.info;
        }
        next(err,body);
    });
}

/**
 * @param uid
 * @param next
 * return 当天在UP直播间的花费总额
 */
function getSendOutDiamond(uid, beginTime, endTime, next) {

    var reqParams = {
        uid         :   parseFloat(uid),
        beginTime   :   beginTime / 1000,
        endTime     :   endTime / 1000
    };

    var raw = cryptoModel.encrypt(reqParams);
    var options = getRequestOption(raw, urls.getSendOutDiamond);

    requestMethod(options, function(err,body){
        next(err,body.info);
    });
}

module.exports = {
    getBalanceInfo  :   getBalanceInfo,
    buyLuckDrawChance   :   buyLuckDrawChance,
    sendReward      :   sendReward,
    getUserInfoByUid     :   getUserInfo,
    getSendOutDiamond   :   getSendOutDiamond
}