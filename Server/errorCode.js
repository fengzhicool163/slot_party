/**
 * 错误码模块
 * Created by lixiaodong on 16/12/22.
 */

var errorCode = {
    INTERNAL_SERVER_ERROR   :   1, //内部服务器错误
    INVALID_REQUEST_PARAMS  :   2, //非法请求参数
    ACTIVITY_NOT_OPEN       :   3, //活动尚未开启
    ACTIVITY_END            :   4, //活动已结束
    NOT_ENOUGH_POINT        :   5, //积分值不够
    NO_CONVERT_TIMES        :   6, //花费金额不足以兑换免费次数
    NOT_ENOUGH_UNIT         :   7, //收集不足 不可领奖
};

errorCode.toString = function (code) {
    return JSON.stringify({ 'error': code });
};

module.exports = errorCode;