/**
 * 用户db模块
 * Created by lixiaodong on 16/12/22.
 */


var schema = require('../schema/user');

function query(uid, next){
    schema.findOne({uid : uid}).exec(next);
}

function queryByOpt(opt,next) {
    schema.find(opt).exec(next);
}

function create(obj,next) {
    var info = new schema(obj);
    info.save(function (err) {
        next(err,info);
    });
}

function update(filter,opt1,opt2,next) {
    schema.update(filter,opt1,opt2,next);
}

module.exports = {
    query   :   query,
    queryByOpt  :   queryByOpt,
    create  :   create,
    update  : update
}