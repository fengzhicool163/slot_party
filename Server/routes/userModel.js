/**
 * Created by lixiaodong on 16/12/22.
 */

var userDao = require('../dao/userDao');
var errorCode = require('../errorCode');
var async = require('async');

function queryUserInfo(uid, next){
    userDao.query(uid,next);
}

function queryUserInfoByOpt(opt,next) {
    userDao.queryByOpt(opt,next);
}

function createUser(obj, next) {
    userDao.create(obj,next);
}

function getUser (uid,next) {
    var userInfo;
    userDao.query(uid, function (err, data) {
        if (!err && !!data) {
            userInfo = data;
        }
        next(err,userInfo);
    });
}


function updateUser(filter,opt1,opt2,next) {
    userDao.update(filter,opt1,opt2,next);
}

/**
 * 购买U钻后调用 更新最新的U钻
 * @param req
 * @param res
 */
function deliveryDiamond(req,res){
    var uid = req.body.id;

    if(!uid){
        return res.send(errorCode.toString(errorCode.INVALID_REQUEST_PARAMS));
    }

    var userInfo;

    async.waterfall([
        function (cb) {
            getUser(uid,function (err,data) {
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

            var upModel = require('./upModel');
            upModel.getBalanceInfo({uid : uid},function (err,data) {
                if(!err && !!data){
                    userInfo.diamond = data;
                }
                cb(err);
            });
        },
        function (cb) {
            userInfo.save(function (err) {
                cb(err);
            });
        }
    ],function (err) {
        if(!err){
            return res.send({diamond : userInfo.diamond});
        } else {
            return res.send(errorCode.toString(errorCode.INTERNAL_SERVER_ERROR));
        }
    });
}

module.exports = {
    getUser             :   getUser,
    createUser          :   createUser,
    updateUser          :   updateUser,
    queryUserInfo       :   queryUserInfo,
    queryUserInfoByOpt  :   queryUserInfoByOpt,
    deliveryDiamond     :   deliveryDiamond
}