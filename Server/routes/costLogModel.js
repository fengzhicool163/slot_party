/**
 * Created by lixiaodong on 16/12/22.
 */
var costLogDao = require('../dao/costLogDao');

/**
 * 添加消费日志
 * @param obj
 * @param next
 */
function addCostLogInfo(obj,next) {
    costLogDao.addCostLog(obj,next);
}

//array return
function queryCostLogInfoByOpt(opt,next) {
    costLogDao.queryCostLog(opt,next);
}

module.exports = {
    addCostLogInfo  :   addCostLogInfo,
    queryCostLogInfoByOpt   :   queryCostLogInfoByOpt
}