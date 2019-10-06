/**
 * 花费日志
 * Created by lixiaodong on 16/12/22.
 */

var mongoose = require('mongoose');
//status 0没得奖 1得奖了 2扣除U钻失败 3发奖失败 4获取U钻数量失败 5摇奖失败
var costLogSchema = new mongoose.Schema({
    uid         :   String,
    line        :   Number,
    bet         :   Number,
    cost        :   Number,
    reward      :   Number,
    status      :   Number,
    createTime  :   Number
});


costLogSchema.pre('save',function (next) {
    next();
});

var costLogModel = mongoose.model('costlog',costLogSchema);

module.exports = costLogModel;