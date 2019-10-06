/**
 * 处理活动配置模块
 * Created by lixiaodong on 16/12/22.
 */

var configUtil = require('../util/configUtil');
var actObj = configUtil.getConfigByName('slotsgamelist')[0];

function getActivityEndTime() {
    var endDate = new Date(actObj.endDate);
    return endDate.getTime();
}

function getActivityStartTime() {
    var startDate = new Date(actObj.openDate);
    return startDate.getTime();
}

exports.getActivityStartTime = getActivityStartTime;
exports.getActivityEndTime = getActivityEndTime;