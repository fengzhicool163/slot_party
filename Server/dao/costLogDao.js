/**
 * Created by lixiaodong on 16/12/22.
 */

var schema = require('../schema/costLog');

/**
 * 添加消费日志
 * @param obj
 * @param next
 */
function addCostLog(obj,next) {
    obj.createTime = Date.now();
    var info = new schema(obj);
    info.save(function (err) {
        next(err);
    });
}

//优先查询从库
function queryCostLog(opt,next) {
    schema.find(opt).read('secondaryPreferred').exec(next);
}

module.exports = {
    addCostLog  :   addCostLog,
    queryCostLog    :   queryCostLog
}